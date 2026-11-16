"""
Builds the photoreal Homeasy hero room in Blender (Cycles) and saves it as a .blend.

Run:  Blender -b --factory-startup --python scripts/blender/build_scene.py -- <project_root>

Assets (all CC0): Poly Haven models/textures/HDRI in assets-source/polyhaven (scripts/blender/README.md),
ambientCG Fabric008 for the rug. Indian-specific items (split AC, tube light, modular switchboard with
indicator LEDs, TV, table lamp) are modelled here. Every light source lives in a named LIGHT GROUP so
render_passes.py can render each group alone and the website can relight the photo per device.

Axes: Z up. Camera looks towards +Y. Back wall inner face at y = BACK_Y. Room x in [-HALF_W, HALF_W].
"""
import bpy, bmesh, json, math, os, sys, glob
from mathutils import Vector

ROOT = sys.argv[sys.argv.index("--") + 1]
PH = os.path.join(ROOT, "assets-source", "polyhaven")
AMBIENTCG = os.path.join(ROOT, "assets-source")
OUT_BLEND = os.path.join(ROOT, "assets-source", "blender", "homeasy_room.blend")

HALF_W = 2.8
BACK_Y = 2.0
FRONT_Y = -4.2
H = 3.0
WIN = dict(x0=-2.15, x1=-0.65, z0=0.9, z1=2.2)  # window opening on the back wall

# ---------------------------------------------------------------- reset & render setup
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
prefs.compute_device_type = "METAL"
prefs.get_devices()
for d in prefs.devices:
    d.use = d.type == "METAL"
scene.cycles.device = "GPU"
scene.cycles.samples = 160
scene.cycles.use_adaptive_sampling = True
scene.cycles.adaptive_threshold = 0.02
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 8
scene.cycles.diffuse_bounces = 4
scene.cycles.glossy_bounces = 4
scene.cycles.transmission_bounces = 6
scene.cycles.caustics_reflective = False
scene.cycles.caustics_refractive = False
scene.cycles.blur_glossy = 1.0
scene.view_settings.view_transform = "Standard"  # linear-ish output so passes add up in the browser
scene.view_settings.look = "None"
scene.render.film_transparent = False

# light groups: name -> list of (emission node socket owner) + light objects
GROUPS = {}


def group_add(name, obj=None, emission=None):
    g = GROUPS.setdefault(name, {"objects": [], "emissions": []})
    if obj is not None:
        g["objects"].append(obj.name)
    if emission is not None:
        g["emissions"].append(emission)


# ---------------------------------------------------------------- materials
def new_mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    return m, m.node_tree.nodes, m.node_tree.links


def principled(name, color=(0.8, 0.8, 0.8, 1), rough=0.5, metal=0.0, **extra):
    m, n, l = new_mat(name)
    p = n["Principled BSDF"]
    p.inputs["Base Color"].default_value = color
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    for k, v in extra.items():
        p.inputs[k].default_value = v
    return m


def textured(name, folder, scale=1.0, tint=None, rough_mult=1.0, rough_bias=0.0):
    m, n, l = new_mat(name)
    p = n["Principled BSDF"]
    coord = n.new("ShaderNodeTexCoord")
    mapping = n.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (scale, scale, scale)
    l.new(coord.outputs["UV"], mapping.inputs["Vector"])

    def tex(file, non_color):
        t = n.new("ShaderNodeTexImage")
        t.image = bpy.data.images.load(os.path.join(folder, file))
        if non_color:
            t.image.colorspace_settings.name = "Non-Color"
        l.new(mapping.outputs["Vector"], t.inputs["Vector"])
        return t

    diff = tex("Diffuse.jpg", False)
    if tint:
        mix = n.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.blend_type = "MULTIPLY"
        mix.inputs["Factor"].default_value = 1.0
        l.new(diff.outputs["Color"], mix.inputs[6])
        mix.inputs[7].default_value = tint
        l.new(mix.outputs[2], p.inputs["Base Color"])
    else:
        l.new(diff.outputs["Color"], p.inputs["Base Color"])
    if os.path.exists(os.path.join(folder, "Rough.jpg")):
        r = tex("Rough.jpg", True)
        mr = n.new("ShaderNodeMath")
        mr.operation = "MULTIPLY_ADD"
        mr.inputs[1].default_value = rough_mult
        mr.inputs[2].default_value = rough_bias
        l.new(r.outputs["Color"], mr.inputs[0])
        l.new(mr.outputs[0], p.inputs["Roughness"])
    if os.path.exists(os.path.join(folder, "nor_gl.jpg")):
        nt = tex("nor_gl.jpg", True)
        nm = n.new("ShaderNodeNormalMap")
        nm.inputs["Strength"].default_value = 0.6
        l.new(nt.outputs["Color"], nm.inputs["Color"])
        l.new(nm.outputs["Normal"], p.inputs["Normal"])
    return m


def emissive(name, color, strength, group):
    """Pure emission material whose strength render_passes.py switches per group."""
    m, n, l = new_mat(name)
    n.remove(n["Principled BSDF"])
    e = n.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = color
    e.inputs["Strength"].default_value = strength
    l.new(e.outputs["Emission"], n["Material Output"].inputs["Surface"])
    e.name = "HE_EMIT"
    e["he_on"] = strength
    group_add(group, emission=m.name)
    return m


def emissive_principled(name, base, emit_color, strength, group, rough=0.4):
    """Surface that looks normal when off and glows when its group is on (e.g. lamp shade)."""
    m = principled(name, base, rough)
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Emission Color"].default_value = emit_color
    p.inputs["Emission Strength"].default_value = strength
    p["he_on"] = strength
    p.name = "HE_EMIT_P"
    group_add(group, emission=m.name)
    return m


# ---------------------------------------------------------------- geometry helpers
def box(name, size, loc, mat, rot=(0, 0, 0), bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        b = o.modifiers.new("bevel", "BEVEL")
        b.width = bevel
        b.segments = 3
        b.limit_method = "ANGLE"
    o.data.materials.append(mat)
    return o


def cyl(name, r, depth, loc, mat, rot=(0, 0, 0), verts=48, r2=None):
    if r2 is None:
        bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, rotation=rot, vertices=verts)
    else:
        bpy.ops.mesh.primitive_cone_add(radius1=r, radius2=r2, depth=depth, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.active_object
    o.name = name
    o.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return o


def plane(name, size, loc, mat, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    o.scale = (size[0], size[1], 1)
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(mat)
    return o


def import_model(asset, loc, rot_z=0.0, scale=1.0):
    path = glob.glob(os.path.join(PH, "models", asset, "*.gltf"))[0]
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    root = bpy.data.objects.new(asset + "_root", None)
    scene.collection.objects.link(root)
    for o in new:
        if o.parent is None:
            o.parent = root
    root.location = loc
    root.rotation_euler = (0, 0, rot_z)
    root.scale = (scale, scale, scale)
    return root, {o.name: o for o in new}


def light(name, kind, loc, energy, color, group, rot=(0, 0, 0), **kw):
    ld = bpy.data.lights.new(name, kind)
    ld.energy = energy
    ld.color = color
    for k, v in kw.items():
        setattr(ld, k, v)
    o = bpy.data.objects.new(name, ld)
    o.location = loc
    o.rotation_euler = rot
    scene.collection.objects.link(o)
    o["he_energy"] = energy
    o.visible_camera = False
    o.visible_glossy = False
    group_add(group, obj=o)
    return o


# ---------------------------------------------------------------- room shell
def paint(name, color, rough=0.6):
    """Smooth emulsion-painted wall with a very faint roller texture."""
    m, n, l = new_mat(name)
    p = n["Principled BSDF"]
    p.inputs["Base Color"].default_value = color
    p.inputs["Roughness"].default_value = rough
    coord = n.new("ShaderNodeTexCoord")
    noise = n.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 180.0
    noise.inputs["Detail"].default_value = 3.0
    l.new(coord.outputs["Object"], noise.inputs["Vector"])
    bump = n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.035
    bump.inputs["Distance"].default_value = 0.002
    l.new(noise.outputs["Fac"], bump.inputs["Height"])
    l.new(bump.outputs["Normal"], p.inputs["Normal"])
    return m


wall_mat = paint("wall_warm_white", (0.82, 0.78, 0.70, 1))
accent_mat = paint("wall_accent_blue", (0.30, 0.43, 0.54, 1))
def vitrified_tiles():
    """Large polished vitrified tiles (60 x 60 cm) with thin grout, common in Indian homes."""
    m, n, l = new_mat("floor_vitrified")
    p = n["Principled BSDF"]
    coord = n.new("ShaderNodeTexCoord")
    brick = n.new("ShaderNodeTexBrick")
    brick.offset = 0.0
    brick.squash = 1.0
    brick.inputs["Scale"].default_value = 1.0
    brick.inputs["Brick Width"].default_value = 0.6
    brick.inputs["Row Height"].default_value = 0.6
    brick.inputs["Mortar Size"].default_value = 0.0025
    brick.inputs["Mortar Smooth"].default_value = 0.2
    brick.inputs["Color1"].default_value = (0.86, 0.82, 0.76, 1)
    brick.inputs["Color2"].default_value = (0.83, 0.79, 0.73, 1)
    brick.inputs["Mortar"].default_value = (0.55, 0.52, 0.48, 1)
    brick.inputs["Bias"].default_value = 0.0
    l.new(coord.outputs["Object"], brick.inputs["Vector"])
    noise = n.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 3.0
    noise.inputs["Detail"].default_value = 6.0
    l.new(coord.outputs["Object"], noise.inputs["Vector"])
    mix = n.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "OVERLAY"
    mix.inputs["Factor"].default_value = 0.12
    l.new(brick.outputs["Color"], mix.inputs[6])
    l.new(noise.outputs["Color"], mix.inputs[7])
    l.new(mix.outputs[2], p.inputs["Base Color"])
    rough = n.new("ShaderNodeMapRange")
    rough.inputs["To Min"].default_value = 0.08
    rough.inputs["To Max"].default_value = 0.6
    l.new(brick.outputs["Fac"], rough.inputs["Value"])  # grout is rough, tile is glossy
    l.new(rough.outputs["Result"], p.inputs["Roughness"])
    return m


floor_mat = vitrified_tiles()
ceil_mat = principled("ceiling", (0.92, 0.91, 0.89, 1), 0.9)
skirt_mat = principled("skirting", (0.22, 0.13, 0.08, 1), 0.45)
frame_mat = principled("window_frame", (0.85, 0.86, 0.87, 1), 0.35, 0.6)
glass_mat = principled("glass", (1, 1, 1, 1), 0.02, 0.0, **{"Transmission Weight": 1.0, "IOR": 1.05})

floor = plane("floor", (HALF_W * 2, BACK_Y - FRONT_Y), (0, (BACK_Y + FRONT_Y) / 2, 0), floor_mat)
ceil = plane("ceiling", (HALF_W * 2, BACK_Y - FRONT_Y), (0, (BACK_Y + FRONT_Y) / 2, H), ceil_mat, rot=(math.pi, 0, 0))
T = 0.15  # wall thickness
cy = BACK_Y + T / 2
box("wall_back_l", (WIN["x0"] + HALF_W, T, H), ((-HALF_W + WIN["x0"]) / 2, cy, H / 2), accent_mat)
box("wall_back_r", (HALF_W - WIN["x1"], T, H), ((WIN["x1"] + HALF_W) / 2, cy, H / 2), accent_mat)
box("wall_back_b", (WIN["x1"] - WIN["x0"], T, WIN["z0"]), ((WIN["x0"] + WIN["x1"]) / 2, cy, WIN["z0"] / 2), accent_mat)
box("wall_back_t", (WIN["x1"] - WIN["x0"], T, H - WIN["z1"]), ((WIN["x0"] + WIN["x1"]) / 2, cy, (H + WIN["z1"]) / 2), accent_mat)
box("wall_left", (T, BACK_Y + T - FRONT_Y, H), (-HALF_W - T / 2, (BACK_Y + T + FRONT_Y) / 2, H / 2), wall_mat)
box("wall_right", (T, BACK_Y + T - FRONT_Y, H), (HALF_W + T / 2, (BACK_Y + T + FRONT_Y) / 2, H / 2), wall_mat)
box("wall_front", (HALF_W * 2 + 2 * T, T, H), (0, FRONT_Y - T / 2, H / 2), wall_mat)
# skirting
box("skirt_back", (HALF_W * 2, 0.015, 0.09), (0, BACK_Y - 0.0075, 0.045), skirt_mat)
box("skirt_left", (0.015, BACK_Y - FRONT_Y, 0.09), (-HALF_W + 0.0075, (BACK_Y + FRONT_Y) / 2, 0.045), skirt_mat)
box("skirt_right", (0.015, BACK_Y - FRONT_Y, 0.09), (HALF_W - 0.0075, (BACK_Y + FRONT_Y) / 2, 0.045), skirt_mat)

# window: aluminium sliding frame + glass
wx = (WIN["x0"] + WIN["x1"]) / 2
wz = (WIN["z0"] + WIN["z1"]) / 2
ww = WIN["x1"] - WIN["x0"]
wh = WIN["z1"] - WIN["z0"]
for nm, s, l in [
    ("win_top", (ww, 0.08, 0.05), (wx, BACK_Y + 0.05, WIN["z1"] - 0.025)),
    ("win_bot", (ww, 0.08, 0.05), (wx, BACK_Y + 0.05, WIN["z0"] + 0.025)),
    ("win_l", (0.05, 0.08, wh), (WIN["x0"] + 0.025, BACK_Y + 0.05, wz)),
    ("win_r", (0.05, 0.08, wh), (WIN["x1"] - 0.025, BACK_Y + 0.05, wz)),
    ("win_mid", (0.04, 0.06, wh), (wx, BACK_Y + 0.06, wz)),
]:
    box(nm, s, l, frame_mat)
g = box("win_glass", (ww - 0.1, 0.006, wh - 0.1), (wx, BACK_Y + 0.07, wz), glass_mat)
g.visible_shadow = False
box("win_sill", (ww + 0.16, 0.2, 0.03), (wx, BACK_Y - 0.06, WIN["z0"] - 0.015), principled("sill", (0.9, 0.88, 0.84, 1), 0.2))

# world: night city HDRI seen through the window (also the ambient dusk light)
world = bpy.data.worlds.new("world")
scene.world = world
world.use_nodes = True
wn = world.node_tree.nodes
wl = world.node_tree.links
env = wn.new("ShaderNodeTexEnvironment")
env.image = bpy.data.images.load(glob.glob(os.path.join(PH, "hdri", "*.hdr"))[0])
wmap = wn.new("ShaderNodeMapping")
wcoord = wn.new("ShaderNodeTexCoord")
wmap.inputs["Rotation"].default_value = (0, 0, math.radians(110))
wl.new(wcoord.outputs["Generated"], wmap.inputs["Vector"])
wl.new(wmap.outputs["Vector"], env.inputs["Vector"])
bg = wn["Background"]
bg.inputs["Strength"].default_value = 0.55
bg.name = "HE_WORLD"
bg["he_on"] = 0.55
wl.new(env.outputs["Color"], bg.inputs["Color"])

# soft evening fill (light spilling in from other rooms) — part of the ambient "dusk" pass
light("fill_evening", "AREA", (0.4, -3.9, 1.5), 90, (0.62, 0.72, 1.0), "ambient",
      rot=(math.radians(62), 0, 0), shape="RECTANGLE", size=3.0, size_y=1.0, spread=math.radians(70))

# ---------------------------------------------------------------- furniture (Poly Haven, CC0)
sofa, _ = import_model("Sofa_01", (0.15, BACK_Y - 0.4, 0), 0, 1.12)
pillows, _ = import_model("throw_pillows_01", (0.15, BACK_Y - 0.5, 0.42), 0, 0.85)
import_model("modern_coffee_table_01", (0.15, BACK_Y - 1.75, 0), math.radians(90), 1.0)
side, _ = import_model("side_table_01", (1.42, BACK_Y - 0.3, 0), 0, 0.9)
import_model("potted_plant_02", (-2.35, BACK_Y - 0.45, 0), math.radians(30), 1.15)
cab, _ = import_model("modern_wooden_cabinet", (HALF_W - 0.28, -0.35, 0), math.radians(-90), 0.72)
import_model("brass_vase_03", (HALF_W - 0.3, -1.1, 0.49), 0, 1.6)
import_model("brass_pot_01", (HALF_W - 0.35, 0.85, 0), 0, 1.3)
# Indian-style 3-blade ceiling fan (own model). Everything that spins hangs off "fan_rotor".
FAN_X, FAN_Y, FAN_Z = 0.35, -0.1, H - 0.3
fan_white = principled("fan_brown", (0.16, 0.08, 0.045, 1), 0.22)
fan_trim = principled("fan_trim", (0.72, 0.55, 0.3, 1), 0.3, 1.0)
cyl("fan_canopy", 0.06, 0.07, (FAN_X, FAN_Y, H - 0.035), fan_white, r2=0.03)
cyl("fan_rod", 0.011, 0.2, (FAN_X, FAN_Y, H - 0.15), fan_trim, verts=16)
rotor = bpy.data.objects.new("fan_rotor", None)
scene.collection.objects.link(rotor)
rotor.location = (FAN_X, FAN_Y, FAN_Z)
FAN_PARTS = []


def rotor_child(o, loc, parent=rotor):
    o.parent = parent
    o.location = loc
    FAN_PARTS.append(o)
    return o


rotor_child(cyl("fan_motor", 0.105, 0.075, (0, 0, 0), fan_white), (0, 0, 0)).modifiers.new("b", "BEVEL").width = 0.015
rotor_child(cyl("fan_motor_ring", 0.108, 0.012, (0, 0, 0), fan_trim), (0, 0, 0))
rotor_child(cyl("fan_cap", 0.06, 0.03, (0, 0, 0), fan_white, r2=0.035), (0, 0, -0.05))
for i in range(3):
    arm = bpy.data.objects.new(f"fan_arm_{i}", None)
    scene.collection.objects.link(arm)
    arm.parent = rotor
    arm.rotation_euler = (0, 0, i * 2 * math.pi / 3)
    blade = box(f"fan_blade_{i}", (0.47, 0.125, 0.004), (0, 0, 0), fan_white, bevel=0.03)
    rotor_child(blade, (0.37, 0, -0.012), arm)
    blade.rotation_euler = (math.radians(9), 0, 0)
    rotor_child(box(f"fan_bracket_{i}", (0.09, 0.045, 0.006), (0, 0, 0), fan_trim), (0.13, 0, -0.008), arm)
for o in FAN_PARTS:
    o["he_fan_blades"] = True
    o.cycles.use_motion_blur = True
    o.cycles.motion_steps = 7
# one third of a turn between frame 1 and 2: with a 1-frame shutter a 3-blade fan blurs into a
# perfectly steady disc, exactly what a running fan looks like to a camera
bpy.context.preferences.edit.keyframe_new_interpolation_type = "LINEAR"
rotor.rotation_euler = (0, 0, 0)
rotor.keyframe_insert("rotation_euler", frame=1)
rotor.rotation_euler = (0, 0, 2 * math.pi / 3)
rotor.keyframe_insert("rotation_euler", frame=2)
scene.frame_set(1)
scene["he_fan"] = json.dumps({"c": [FAN_X, FAN_Y, FAN_Z], "r": 0.62})

# rug (ambientCG Fabric008, CC0)
rug_m, rn, rl = new_mat("rug")
rt = rn.new("ShaderNodeTexImage")
rt.image = bpy.data.images.load(os.path.join(AMBIENTCG, "Fabric008_1K-JPG", "Fabric008_1K-JPG_Color.jpg"))
rmap = rn.new("ShaderNodeMapping")
rmap.inputs["Scale"].default_value = (3, 2, 1)
rc = rn.new("ShaderNodeTexCoord")
rl.new(rc.outputs["UV"], rmap.inputs["Vector"])
rl.new(rmap.outputs["Vector"], rt.inputs["Vector"])
rl.new(rt.outputs["Color"], rn["Principled BSDF"].inputs["Base Color"])
rn["Principled BSDF"].inputs["Roughness"].default_value = 0.95
rug = box("rug", (2.4, 1.7, 0.012), (0.15, BACK_Y - 1.65, 0.006), rug_m)

# ---------------------------------------------------------------- custom Indian-home elements
white_plastic = principled("white_plastic", (0.9, 0.9, 0.9, 1), 0.28)
alu = principled("aluminium", (0.8, 0.8, 0.82, 1), 0.3, 0.9)
black_gloss = principled("black_gloss", (0.01, 0.01, 0.012, 1), 0.08)
brass = principled("brass", (0.78, 0.56, 0.28, 1), 0.3, 1.0)
fabric_shade_base = (0.93, 0.86, 0.74, 1)

# split AC above the window
ac_y = BACK_Y - 0.14
box("ac_body", (0.92, 0.24, 0.29), (wx, ac_y, 2.52), white_plastic, bevel=0.03)
box("ac_vent", (0.8, 0.02, 0.035), (wx, ac_y - 0.115, 2.41), principled("ac_vent", (0.55, 0.56, 0.58, 1), 0.5))
box("ac_display", (0.06, 0.004, 0.025), (wx + 0.33, ac_y - 0.122, 2.5), black_gloss)
ac_led = box("ac_led", (0.012, 0.004, 0.012), (wx + 0.36, ac_y - 0.125, 2.5), emissive("ac_led", (0.45, 0.8, 1.0, 1), 30, "ac"))

# wall tube light above the picture (classic Indian batten)
tube_z = 2.62
box("tube_batten", (1.24, 0.06, 0.05), (0.15, BACK_Y - 0.03, tube_z), white_plastic, bevel=0.01)
tube = cyl("tube_diffuser", 0.018, 1.18, (0.15, BACK_Y - 0.07, tube_z - 0.005),
           emissive_principled("tube_glow", (0.95, 0.95, 0.94, 1), (1.0, 0.97, 0.92, 1), 18, "tube", rough=0.3),
           rot=(0, math.radians(90), 0), verts=24)
light("tube_light", "AREA", (0.15, BACK_Y - 0.1, tube_z - 0.02), 110, (1.0, 0.96, 0.9), "tube",
      rot=(math.radians(100), 0, 0), shape="RECTANGLE", size=1.18, size_y=0.05)

# TV on the cabinet (left wall, facing +X)
tv_x = HALF_W - 0.06
tv_y = -0.35
tv_z = 0.49 + 0.38
box("tv_bezel", (0.035, 1.12, 0.65), (tv_x, tv_y, tv_z), black_gloss, bevel=0.004)
# TV picture: a calm sunrise landscape generated here (no third-party imagery)
img = bpy.data.images.new("tv_picture", 512, 288)
px = []
for yy in range(288):
    t = yy / 287.0
    for xx in range(512):
        sky = (0.23 + 0.6 * t, 0.6 + 0.3 * t, 0.86 + 0.1 * t)
        d = math.hypot(xx - 370, yy - 190)
        if d < 34:
            sky = (0.98, 0.71, 0.27)
        hill = 70 + 30 * math.sin(xx / 70.0) + 18 * math.sin(xx / 23.0)
        if yy < hill:
            sky = (0.13, 0.33, 0.48) if yy > hill - 40 else (0.04, 0.07, 0.13)
        px += [sky[0], sky[1], sky[2], 1.0]
img.pixels = px
img.pack()
tv_m, tn, tl = new_mat("tv_screen")
tn.remove(tn["Principled BSDF"])
ti = tn.new("ShaderNodeTexImage")
ti.image = img
te = tn.new("ShaderNodeEmission")
te.inputs["Strength"].default_value = 2.2
te.name = "HE_EMIT"
te["he_on"] = 2.2
tl.new(ti.outputs["Color"], te.inputs["Color"])
tl.new(te.outputs["Emission"], tn["Material Output"].inputs["Surface"])
group_add("tv", emission=tv_m.name)
scr = plane("tv_screen", (1.08, 0.61), (tv_x - 0.019, tv_y, tv_z), tv_m, rot=(math.radians(90), 0, math.radians(-90)))
light("tv_spill", "AREA", (tv_x - 0.08, tv_y, tv_z), 25, (0.6, 0.78, 1.0), "tv",
      rot=(0, math.radians(90), 0), shape="RECTANGLE", size=1.0, size_y=0.55)

# table lamp on the side table
lamp_x, lamp_y = 1.42, BACK_Y - 0.3
top = 0.55 * 0.9
cyl("lamp_base", 0.075, 0.03, (lamp_x, lamp_y, top + 0.015), brass)
cyl("lamp_stem", 0.012, 0.32, (lamp_x, lamp_y, top + 0.19), brass, verts=16)
shade_m = emissive_principled("lamp_shade", fabric_shade_base, (1.0, 0.72, 0.38, 1), 4.0, "lamp", rough=0.9)
shade_m.node_tree.nodes["HE_EMIT_P"].inputs["Transmission Weight"].default_value = 0.0
shade = cyl("lamp_shade", 0.17, 0.22, (lamp_x, lamp_y, top + 0.43), shade_m, r2=0.12)
shade.modifiers.new("solid", "SOLIDIFY").thickness = 0.004
light("lamp_bulb", "POINT", (lamp_x, lamp_y, top + 0.4), 45, (1.0, 0.72, 0.42), "lamp", shadow_soft_size=0.04)

# modular switchboard (generic, no brand): plate + 4 rockers + 4 indicator LEDs
sw_x, sw_z = 1.98, 1.25
plate_m = principled("switch_plate", (0.93, 0.93, 0.92, 1), 0.18)
box("switch_plate", (0.26, 0.012, 0.13), (sw_x, BACK_Y - 0.006, sw_z), plate_m, bevel=0.004)
rock_m = principled("rocker", (0.95, 0.95, 0.94, 1), 0.22)
for i in range(4):
    x = sw_x - 0.087 + i * 0.058
    r = box(f"rocker_{i + 1}", (0.044, 0.012, 0.085), (x, BACK_Y - 0.016, sw_z - 0.005), rock_m,
            rot=(math.radians(6), 0, 0), bevel=0.003)
    box(f"switch_led_{i + 1}", (0.006, 0.004, 0.006), (x, BACK_Y - 0.0235, sw_z + 0.047),
        emissive(f"switch_led_{i + 1}", (1.0, 0.45, 0.08, 1), 25, f"sw{i + 1}"))

# switchbox recess behind the plate (cut into the wall) + what's inside it.
# Hidden behind the plate in the room shots; revealed in the "inside" close-up (plate removed).
cutter = box("switchbox_cutter", (0.235, 0.14, 0.105), (sw_x, BACK_Y + 0.06, sw_z), principled("cut", (0, 0, 0, 1)))
for wall_name in ("wall_back_r",):
    bm = bpy.data.objects[wall_name].modifiers.new("switchbox", "BOOLEAN")
    bm.operation = "DIFFERENCE"
    bm.object = cutter
cutter.hide_render = True
cutter.hide_viewport = True
box_m = principled("switchbox_metal", (0.32, 0.33, 0.35, 1), 0.55, 0.6)
box("switchbox_back", (0.235, 0.004, 0.105), (sw_x, BACK_Y + 0.125, sw_z), box_m)
box("switchbox_top", (0.235, 0.12, 0.004), (sw_x, BACK_Y + 0.065, sw_z + 0.0505), box_m)
box("switchbox_bot", (0.235, 0.12, 0.004), (sw_x, BACK_Y + 0.065, sw_z - 0.0505), box_m)
box("switchbox_l", (0.004, 0.12, 0.105), (sw_x - 0.1155, BACK_Y + 0.065, sw_z), box_m)
box("switchbox_r", (0.004, 0.12, 0.105), (sw_x + 0.1155, BACK_Y + 0.065, sw_z), box_m)
# switch mechanisms (backs of the 4 modular switches) on a metal frame
frame_m = principled("switch_frame", (0.7, 0.71, 0.72, 1), 0.35, 0.8)
box("switch_frame", (0.25, 0.004, 0.012), (sw_x, BACK_Y + 0.004, sw_z + 0.046), frame_m)
mech_m = principled("switch_mech", (0.88, 0.88, 0.86, 1), 0.4)
for i in range(4):
    x = sw_x - 0.087 + i * 0.058
    box(f"switch_mech_{i + 1}", (0.042, 0.026, 0.04), (x, BACK_Y + 0.016, sw_z + 0.022), mech_m, bevel=0.002)
# the Homeasy retrofit module (generic illustrative shape until real product CAD exists)
mod_m = principled("module_body", (0.95, 0.95, 0.95, 1), 0.3)
module = box("homeasy_module", (0.085, 0.032, 0.036), (sw_x + 0.01, BACK_Y + 0.06, sw_z - 0.028), mod_m, bevel=0.004)
box("module_band", (0.0855, 0.0325, 0.009), (sw_x + 0.01, BACK_Y + 0.06, sw_z - 0.0145), principled("module_band", (0.23, 0.6, 0.86, 1), 0.35))
box("module_led", (0.004, 0.003, 0.004), (sw_x + 0.043, BACK_Y + 0.0435, sw_z - 0.032), emissive("module_led", (0.3, 0.75, 1.0, 1), 40, "module"))
for j in range(4):
    box(f"module_term_{j}", (0.008, 0.004, 0.008), (sw_x - 0.02 + j * 0.016, BACK_Y + 0.0435, sw_z - 0.034), alu)
# wires: phase (red), neutral (black), loads (yellow) from module to switches
wire_cols = [(0.6, 0.05, 0.04, 1), (0.03, 0.03, 0.03, 1), (0.85, 0.65, 0.05, 1), (0.85, 0.65, 0.05, 1)]
for j, col in enumerate(wire_cols):
    wm = principled(f"wire_{j}", col, 0.45)
    start = Vector((sw_x - 0.02 + j * 0.016, BACK_Y + 0.044, sw_z - 0.03))
    end = Vector((sw_x - 0.087 + j * 0.058, BACK_Y + 0.02, sw_z + 0.003))
    mid = (start + end) / 2 + Vector((0, -0.006, -0.004))
    curve = bpy.data.curves.new(f"wire_{j}", "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = 0.0022
    sp = curve.splines.new("BEZIER")
    sp.bezier_points.add(2)
    for bp, co in zip(sp.bezier_points, (start, mid, end)):
        bp.co = co
        bp.handle_left_type = bp.handle_right_type = "AUTO"
    wo = bpy.data.objects.new(f"wire_{j}", curve)
    wo.data.materials.append(wm)
    scene.collection.objects.link(wo)

# objects removed for the "plate off" close-up
PLATE_PARTS = ["switch_plate"] + [f"rocker_{i + 1}" for i in range(4)] + [f"switch_led_{i + 1}" for i in range(4)]
scene["he_plate_parts"] = ",".join(PLATE_PARTS)

# ---------------------------------------------------------------- soft furnishings & decor
def curtain(name, x0, x1, z0, z1, y, mat, folds=6):
    cols, rows = 120, 8
    verts, faces = [], []
    for i in range(cols + 1):
        t = i / cols
        for r in range(rows + 1):
            v = r / rows
            amp = 0.018 + 0.022 * (1 - v)  # pleats open up towards the hem
            yy = y + amp * math.sin(t * folds * 2 * math.pi) + 0.006 * math.sin(t * folds * 5.3 + v * 2.0)
            verts.append((x0 + (x1 - x0) * t, yy, z0 + (z1 - z0) * v))
    for i in range(cols):
        for r in range(rows):
            a = i * (rows + 1) + r
            faces.append((a, a + rows + 1, a + rows + 2, a + 1))
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    uv = me.uv_layers.new()
    for poly in me.polygons:
        poly.use_smooth = True
        for li in poly.loop_indices:
            vi = me.loops[li].vertex_index
            uv.data[li].uv = ((vi // (rows + 1)) / cols * 2.2, (vi % (rows + 1)) / rows * 4.0)
    o = bpy.data.objects.new(name, me)
    o.data.materials.append(mat)
    scene.collection.objects.link(o)
    return o


# warm cream linen: flat colour + the linen weave as a normal map (the texture's own colour is blue)
curtain_mat, cn, cl = new_mat("curtain_linen")
cp = cn["Principled BSDF"]
cp.inputs["Base Color"].default_value = (0.86, 0.74, 0.53, 1)
cp.inputs["Roughness"].default_value = 0.85
cp.inputs["Sheen Weight"].default_value = 0.4
cnt = cn.new("ShaderNodeTexImage")
cnt.image = bpy.data.images.load(os.path.join(PH, "textures", "rough_linen", "nor_gl.jpg"))
cnt.image.colorspace_settings.name = "Non-Color"
cnm = cn.new("ShaderNodeNormalMap")
cnm.inputs["Strength"].default_value = 0.8
cl.new(cnt.outputs["Color"], cnm.inputs["Color"])
cl.new(cnm.outputs["Normal"], cp.inputs["Normal"])
cur_y = BACK_Y - 0.1
curtain("curtain_l", WIN["x0"] - 0.32, WIN["x0"] + 0.2, 0.06, 2.3, cur_y, curtain_mat)
curtain("curtain_r", WIN["x1"] - 0.38, WIN["x1"] - 0.08, 0.06, 2.3, cur_y, curtain_mat, folds=4)
cyl("curtain_rod", 0.011, ww + 0.9, (wx - 0.05, cur_y, 2.305), brass, rot=(0, math.radians(90), 0), verts=16)
for sx in (-1, 1):
    cyl(f"curtain_finial_{sx}", 0.02, 0.03, (wx - 0.05 + sx * (ww + 0.9) / 2, cur_y, 2.305), brass,
        rot=(0, math.radians(90), 0), verts=16)

# framed print above the sofa (own artwork: sun over hills in the brand colours)
art = bpy.data.images.new("art_print", 300, 200)
apx = []
for yy in range(200):
    for xx in range(300):
        c = (0.93, 0.89, 0.8)
        if math.hypot(xx - 205, yy - 128) < 34:
            c = (0.94, 0.62, 0.2)
        if yy < 70 + 26 * math.sin(xx / 46.0):
            c = (0.23, 0.42, 0.55)
        if yy < 44 + 20 * math.sin(xx / 31.0 + 2.0):
            c = (0.08, 0.14, 0.24)
        apx += [c[0], c[1], c[2], 1.0]
art.pixels = apx
art.pack()
art_m, an, al = new_mat("art_print")
ai = an.new("ShaderNodeTexImage")
ai.image = art
al.new(ai.outputs["Color"], an["Principled BSDF"].inputs["Base Color"])
an["Principled BSDF"].inputs["Roughness"].default_value = 0.7
box("art_frame", (0.96, 0.025, 0.66), (0.15, BACK_Y - 0.0125, 1.68), principled("art_frame", (0.12, 0.07, 0.04, 1), 0.4), bevel=0.004)
plane("art_mat", (0.9, 0.6), (0.15, BACK_Y - 0.026, 1.68), principled("art_matboard", (0.93, 0.92, 0.88, 1), 0.8), rot=(math.radians(90), 0, 0))
plane("art_picture", (0.72, 0.44), (0.15, BACK_Y - 0.027, 1.68), art_m, rot=(math.radians(90), 0, 0))

import_model("wall_clock", (1.42, BACK_Y, 2.02), 0, 1.0)
import_model("standing_picture_frame_01", (HALF_W - 0.3, 0.38, 0.49), math.pi, 1.0)
# books on the coffee table
for k, (col, sz) in enumerate([((0.55, 0.2, 0.12, 1), (0.26, 0.19, 0.035)), ((0.12, 0.25, 0.38, 1), (0.24, 0.17, 0.03)),
                               ((0.85, 0.8, 0.7, 1), (0.2, 0.15, 0.025))]):
    box(f"book_{k}", sz, (-0.1, BACK_Y - 1.72, 0.39 + sum(b for b in [0.035, 0.03, 0.025][:k]) + sz[2] / 2),
        principled(f"book_{k}", col, 0.6), rot=(0, 0, math.radians(8 + k * 9)), bevel=0.002)

# ---------------------------------------------------------------- cameras
def camera(name, loc, target, lens, shift_x=0.0, shift_y=0.0):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.shift_x = shift_x
    cd.shift_y = shift_y
    cd.clip_start = 0.05
    o = bpy.data.objects.new(name, cd)
    scene.collection.objects.link(o)
    o.location = loc
    direction = Vector(target) - Vector(loc)
    o.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return o


camera("cam_desktop", (-0.9, -4.05, 1.45), (1.2, BACK_Y, 1.2), 20.5, shift_x=-0.22)
camera("cam_mobile", (0.4, -3.3, 1.38), (1.35, BACK_Y, 1.3), 25)
# close-up on the switchboard for the "see inside" view (slightly from the left, like a person looking at it)
camera("cam_switch", (sw_x - 0.14, BACK_Y - 0.5, sw_z + 0.07), (sw_x, BACK_Y + 0.03, sw_z - 0.005), 36, shift_x=-0.2)
# a soft key light for the close-up only (its own group, used just for the inside stills)
light("switch_key", "AREA", (sw_x - 0.35, BACK_Y - 0.5, sw_z + 0.35), 3, (1.0, 0.95, 0.88), "closeup",
      rot=(math.radians(55), 0, math.radians(-35)), shape="RECTANGLE", size=0.5, size_y=0.5)
scene.camera = bpy.data.objects["cam_desktop"]

# store groups for the pass renderer
import json
scene["he_groups"] = json.dumps(GROUPS)
os.makedirs(os.path.dirname(OUT_BLEND), exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=OUT_BLEND)
print("SAVED", OUT_BLEND, "groups:", list(GROUPS))

"""
Renders the light passes for the photoreal hero.

Run:  Blender -b assets-source/blender/homeasy_room.blend --python scripts/blender/render_passes.py -- <out_dir> <mode> [cams]
  mode = preview  -> one "everything on" + one "everything off" frame per camera at low res (composition check)
  mode = passes   -> full set: ambient, tube, lamp, tv (+ crops for ac / switch LEDs / fan) + depth + hotspots.json

Each pass is rendered with ONLY its light group on (world off for non-ambient passes), Standard view
transform, so the browser can add them in linear light: image = ambient + sum(on_i * pass_i).
"""
import bpy, json, math, os, sys
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1:]
OUT = args[0]
MODE = args[1]
CAMS = args[2].split(",") if len(args) > 2 else ["desktop", "mobile"]
os.makedirs(OUT, exist_ok=True)

scene = bpy.context.scene
prefs = bpy.context.preferences.addons["cycles"].preferences
prefs.compute_device_type = "METAL"
prefs.get_devices()
for d in prefs.devices:
    d.use = d.type == "METAL"
scene.cycles.device = "GPU"
GROUPS = json.loads(scene["he_groups"])
scene.frame_set(1)
scene.render.use_motion_blur = False
RES = {"desktop": (1920, 1080), "mobile": (1080, 1350), "switch": (1600, 1000)}
PASS_EXPOSURE = {"ambient": 0.0, "tube": -1.0, "lamp": -1.0, "tv": -1.0, "ac": 0.0, "sw": 0.0}


def set_groups(on):
    """Turn every light group off except those in `on`."""
    for name, g in GROUPS.items():
        active = name in on
        for oname in g["objects"]:
            o = bpy.data.objects[oname]
            o.data.energy = o["he_energy"] if active else 0.0
        for mname in g["emissions"]:
            m = bpy.data.materials[mname]
            for node in m.node_tree.nodes:
                if node.name == "HE_EMIT":
                    node.inputs["Strength"].default_value = node["he_on"] if active else 0.0
                elif node.name == "HE_EMIT_P":
                    node.inputs["Emission Strength"].default_value = node["he_on"] if active else 0.0
    bg = scene.world.node_tree.nodes["HE_WORLD"]
    bg.inputs["Strength"].default_value = bg["he_on"] if "ambient" in on else 0.0


def render(path, cam, scale=1.0, samples=None, exposure=0.0, border=None, fmt="JPEG"):
    scene.camera = bpy.data.objects[f"cam_{cam}"]
    w, h = RES[cam]
    r = scene.render
    r.resolution_x, r.resolution_y = w, h
    r.resolution_percentage = int(scale * 100)
    scene.view_settings.exposure = exposure
    if samples:
        scene.cycles.samples = samples
    r.use_border = border is not None
    r.use_crop_to_border = border is not None
    if border:
        r.border_min_x, r.border_min_y, r.border_max_x, r.border_max_y = border
    r.image_settings.file_format = fmt
    if fmt == "JPEG":
        r.image_settings.quality = 92
    r.filepath = path
    bpy.ops.render.render(write_still=True)
    print("RENDERED", path)


def screen_rect(cam, names, pad=0.02):
    """Normalised (0..1, origin bottom-left) bounding box of objects as seen by a camera."""
    c = bpy.data.objects[f"cam_{cam}"]
    w, h = RES[cam]
    scene.render.resolution_x, scene.render.resolution_y = w, h
    xs, ys = [], []
    dg = bpy.context.evaluated_depsgraph_get()
    for n in names:
        o = bpy.data.objects[n].evaluated_get(dg)
        for v in o.bound_box:
            p = world_to_camera_view(scene, c, o.matrix_world @ Vector(v))
            xs.append(p.x)
            ys.append(p.y)
    x0, x1 = max(0.0, min(xs) - pad), min(1.0, max(xs) + pad)
    y0, y1 = max(0.0, min(ys) - pad), min(1.0, max(ys) + pad)
    return [round(x0, 4), round(y0, 4), round(x1, 4), round(y1, 4)]


def objects_with(prefix):
    return [o.name for o in bpy.data.objects if o.name.startswith(prefix) and o.type == "MESH"]


def render_depth(path, cam):
    """Greyscale depth (near = white) for the browser's parallax shader."""
    m = bpy.data.materials.new("he_depth")
    m.use_nodes = True
    n, l = m.node_tree.nodes, m.node_tree.links
    n.remove(n["Principled BSDF"])
    camd = n.new("ShaderNodeCameraData")
    mr = n.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = 1.0
    mr.inputs["From Max"].default_value = 8.0
    mr.inputs["To Min"].default_value = 1.0
    mr.inputs["To Max"].default_value = 0.0
    l.new(camd.outputs["View Z Depth"], mr.inputs["Value"])
    e = n.new("ShaderNodeEmission")
    l.new(mr.outputs["Result"], e.inputs["Color"])
    l.new(e.outputs["Emission"], n["Material Output"].inputs["Surface"])
    vl = bpy.context.view_layer
    vl.material_override = m
    set_groups([])
    den, smp = scene.cycles.use_denoising, scene.cycles.samples
    scene.cycles.use_denoising = False
    render(path, cam, scale=0.5, samples=4, fmt="PNG")
    scene.cycles.use_denoising, scene.cycles.samples = den, smp
    vl.material_override = None


def fan_rect(cam, pad=0.035):
    """Screen rectangle covering the whole disc swept by the fan blades."""
    f = json.loads(scene["he_fan"])
    c = bpy.data.objects[f"cam_{cam}"]
    w, h = RES[cam]
    scene.render.resolution_x, scene.render.resolution_y = w, h
    xs, ys = [], []
    for i in range(48):
        a = i / 48 * 2 * math.pi
        for dz in (0.06, -0.08):
            p = world_to_camera_view(scene, c, Vector((f["c"][0] + f["r"] * math.cos(a), f["c"][1] + f["r"] * math.sin(a), f["c"][2] + dz)))
            xs.append(p.x)
            ys.append(p.y)
    return [round(max(0.0, min(xs) - pad), 4), round(max(0.0, min(ys) - pad), 4),
            round(min(1.0, max(xs) + pad), 4), round(min(1.0, max(ys) + pad), 4)]


ALL = list(GROUPS)

if MODE == "preview":
    for cam in CAMS:
        set_groups(ALL)
        render(os.path.join(OUT, f"preview_{cam}_on.jpg"), cam, scale=0.4, samples=48)
        set_groups(["ambient"])
        render(os.path.join(OUT, f"preview_{cam}_off.jpg"), cam, scale=0.4, samples=48)
        set_groups(ALL)
        scene.render.use_motion_blur = True
        scene.render.motion_blur_shutter = 1.0
        scene.render.motion_blur_position = "START"
        render(os.path.join(OUT, f"preview_{cam}_fan.jpg"), cam, scale=0.4, samples=64)
        scene.render.use_motion_blur = False

elif MODE == "passes":
    for cam in CAMS:
        d = os.path.join(OUT, cam)
        os.makedirs(d, exist_ok=True)
        meta = {"size": RES[cam], "passes": {}, "crops": {}, "hotspots": {}}
        for p in ["ambient", "tube", "lamp", "tv"]:
            set_groups([p])
            render(os.path.join(d, f"{p}.jpg"), cam, exposure=PASS_EXPOSURE[p])
            meta["passes"][p] = {"file": f"{p}.jpg", "gain": 2 ** -PASS_EXPOSURE[p]}
        # small passes rendered only inside their screen rectangle (fast, tiny files)
        crops = {"ac": (["ac"], ["ac_body", "ac_led", "ac_display"]),
                 "sw1": (["sw1"], ["switch_plate"]), "sw2": (["sw2"], ["switch_plate"]),
                 "sw3": (["sw3"], ["switch_plate"]), "sw4": (["sw4"], ["switch_plate"])}
        for key, (groups, objs) in crops.items():
            rect = screen_rect(cam, objs, pad=0.03)
            set_groups(groups)
            render(os.path.join(d, f"{key}.png"), cam, exposure=0.0, border=rect, fmt="PNG", samples=96)
            meta["crops"][key] = {"file": f"{key}.png", "rect": rect}
        # hotspots for click/hover
        hs = {
            "tube": ["tube_batten", "tube_diffuser"],
            "lamp": ["lamp_shade", "lamp_base"],
            "tv": ["tv_bezel"],
            "ac": ["ac_body"],
            "switch": ["switch_plate"],
        }
        for k, objs in hs.items():
            meta["hotspots"][k] = screen_rect(cam, objs, pad=0.01)
        frect = fan_rect(cam)
        meta["hotspots"]["fan"] = frect
        # the fan running: true motion blur (blades turn 120 degrees during the exposure), one crop per light pass
        scene.render.use_motion_blur = True
        scene.render.motion_blur_shutter = 1.0
        scene.render.motion_blur_position = "START"
        meta["fanspin"] = {"rect": frect, "files": {}}
        for p in ["ambient", "tube", "lamp", "tv"]:
            set_groups([p])
            render(os.path.join(d, f"fan_{p}.jpg"), cam, exposure=PASS_EXPOSURE[p], border=frect, samples=220)
            meta["fanspin"]["files"][p] = f"fan_{p}.jpg"
        scene.render.use_motion_blur = False
        scene.cycles.samples = 160
        render_depth(os.path.join(d, "depth.png"), cam)
        meta["depth"] = "depth.png"
        with open(os.path.join(d, "meta.json"), "w") as f:
            json.dump(meta, f, indent=1)
        print("META", cam, json.dumps(meta)[:400])

elif MODE == "switch":
    d = os.path.join(OUT, "switch")
    os.makedirs(d, exist_ok=True)
    parts = scene.get("he_plate_parts", "").split(",")
    # shown directly (not blended), so use a natural filmic look
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
    set_groups(["ambient", "closeup"])
    render(os.path.join(d, "closed.jpg"), "switch", samples=192)
    for n in parts:
        bpy.data.objects[n].hide_render = True
    set_groups(["ambient", "closeup", "module"])
    render(os.path.join(d, "open.jpg"), "switch", samples=192)
    for n in parts:
        bpy.data.objects[n].hide_render = False

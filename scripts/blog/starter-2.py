# Starter articles 6-10 (text only). Joined into data/blog-starter.json by scripts/blog/build-starter.py
ARTICLES = []
def add(**k): ARTICLES.append(k)

add(
 slug="smart-fan-regulator-control-fan-speed-from-phone", category="Appliances", focus_keyword="smart fan regulator",
 title="Smart Fan Regulator: Control Fan Speed From Your Phone",
 excerpt="A smart fan regulator lets you change ceiling fan speed from your phone while the wall regulator stays. Here is how it works and what to check.",
 body="""
<p>The ceiling fan runs more hours than anything else in an Indian home, and it is the one thing people most want to adjust without getting out of bed. A smart fan regulator makes that possible. This guide explains how it differs from a simple smart switch, and what has to be checked in your switchbox first.</p>
<h2>Why a fan needs more than an on/off module</h2>
<p>A light is either on or off. A fan has speeds. If you put a plain on/off relay on a fan, you can start and stop it from the app, and the speed stays wherever the wall regulator was left. That is half the job.</p>
<p>A fan also behaves differently from a light electrically, because it has a motor. A module made for lights is not the right part for it. Fans need a controller designed for fans.</p>
<h2>How a smart fan regulator works</h2>
<p>A fan controller module is fitted inside the switchbox, on the fan's circuit. It takes over the job of setting the speed, in steps, and it accepts commands from the app. You choose the speed on your phone, and the module sets it.</p>
<p>The Homeasy Fan Controller gives you fan on/off and speed from the app. Because homes have different kinds of regulators, we confirm the fit with your regulator at the survey instead of assuming it.</p>
<h2>Regulators found in Indian homes</h2>
<ul>
<li><p><strong>Old box-type regulators.</strong> Large, warm to the touch, with a rotary knob. They take up a lot of space in the board.</p></li>
<li><p><strong>Electronic step regulators.</strong> The compact modular type with a knob that clicks through speeds. These are the most common in newer boards.</p></li>
<li><p><strong>Fans with their own remote.</strong> Some newer fans have the speed control inside the fan and come with a handset.</p></li>
</ul>
<p>Each of these calls for a slightly different approach, which is why the survey looks at the regulator and the fan, not only at the switch.</p>
<h2>What is checked before fitting</h2>
<ol>
<li><p><strong>Space in the box.</strong> The controller needs room behind the plate.</p></li>
<li><p><strong>The wiring in that box.</strong> Including whether a neutral wire is present, where the module needs one.</p></li>
<li><p><strong>The type of fan and regulator.</strong> To confirm the controller suits it.</p></li>
<li><p><strong>Wi-Fi reach at that board.</strong> App control needs Wi-Fi and internet.</p></li>
</ol>
<h2>What you can do once it is fitted</h2>
<ul>
<li><p>Change the speed from bed, or switch the fan off in a room you have left.</p></li>
<li><p>Include the fan in a scene, so "Good night" can lower the speed and switch off the lights together.</p></li>
<li><p>Set a schedule, such as a lower speed in the early hours when it gets cooler.</p></li>
<li><p>Let family members use the same controls from their own phones.</p></li>
</ul>
<h2>Common questions</h2>
<p><strong>Will the fan make a humming noise?</strong> Hum can come from a controller that does not suit the fan. Matching the two properly is the reason we check at the survey.</p>
<p><strong>Can I still use the fan without the phone?</strong> Yes. Your switches work by hand as before, even if the internet is down.</p>
<p><strong>Does it work with Alexa or Google?</strong> People often search for a smart fan regulator with voice control. For Homeasy, voice assistant support is planned and not available yet.</p>
<p><strong>Do I need a new fan?</strong> No. The point of retrofit is to keep the fan and the switchboard you have.</p>
<h2>Mistakes to avoid</h2>
<ul>
<li><p>Fitting a light relay on a fan circuit.</p></li>
<li><p>Buying a controller before anyone has opened the switchbox.</p></li>
<li><p>Leaving both an old regulator and a new controller trying to set the speed on the same fan.</p></li>
<li><p>Skipping the Wi-Fi check in the bedroom farthest from the router.</p></li>
</ul>
<h2>Getting it done</h2>
<p>A fan is a small upgrade that you notice every single night. If you want it done properly, have the regulator and the box looked at first. The <a href="/products">products page</a> describes the Fan Controller, and the <a href="/installation">installation page</a> explains what happens on the day. When you are ready, <a href="/book-survey">book a free home survey</a> and we will check every fan point in your home.</p>
""")

add(
 slug="geyser-smart-switch", category="Appliances", focus_keyword="geyser smart switch",
 title="Geyser Smart Switch: Schedule Hot Water, Stop the Worry",
 excerpt="A geyser smart switch lets you schedule hot water and switch the geyser off from anywhere. Here is what it needs and why the module matters.",
 body="""
<p>"Did anyone switch off the geyser?" is asked in almost every Indian home, usually from the car. A geyser smart switch answers it. You can check from your phone, switch it off from anywhere, and set a schedule so it is not left on by mistake. This guide covers how it works and why a geyser must never be treated like a light.</p>
<h2>Why the geyser is different</h2>
<p>A geyser is a heavy load. It draws far more current than a light or a fan, which is why it sits on a larger, higher-rated switch and socket. Any smart module on that circuit has to be built for the same heavy load.</p>
<p>This is the most important point in this article: a small relay module made for lights must not be used on a geyser. It can overheat. If a seller offers one module "for everything", ask what its rating is and what it is meant for.</p>
<h2>How a geyser smart switch works</h2>
<p>A module rated for heavy loads is fitted inside the switchbox of the geyser point, behind the existing switch. The switch on the wall keeps working by hand. The module adds two things: control from the app, and schedules.</p>
<p>The Homeasy Power Module (16A) is the one we use for geysers, ACs and water motors. As with every module, the box is checked at the survey before anything is promised.</p>
<h2>What you can do with it</h2>
<ul>
<li><p><strong>Schedule the morning.</strong> Have hot water ready when you wake up, and have the geyser switch itself off afterwards.</p></li>
<li><p><strong>Switch off from anywhere.</strong> If you left in a hurry, open the app and turn it off.</p></li>
<li><p><strong>Check the state.</strong> See whether it is on without walking to the bathroom.</p></li>
<li><p><strong>Share it.</strong> Everyone at home can use the same schedule and controls.</p></li>
</ul>
<p>App control needs Wi-Fi and internet. The wall switch works by hand whether or not the internet is up.</p>
<h2>Does it save electricity?</h2>
<p>We do not quote a savings percentage, because we have no measurements of our own to stand behind one, and every home is different. What can be said plainly is this: a geyser that is left on for hours after the last bath is using power for nothing, and a schedule or a quick tap in the app stops that. How much it matters in your home depends on how often it happens.</p>
<h2>What is checked at the survey</h2>
<ol>
<li><p><strong>The geyser point and its switch.</strong> Its rating and condition.</p></li>
<li><p><strong>The wiring.</strong> Loose or heat-damaged joints at a geyser point are fixed before a module goes in, and you are told first.</p></li>
<li><p><strong>Space in the box.</strong> The power module needs room.</p></li>
<li><p><strong>Wi-Fi at the bathroom wall.</strong> Bathrooms are often the weakest spot for signal.</p></li>
</ol>
<h2>Safety comes first</h2>
<p>A smart module does not replace the safety parts of your geyser or your home. The thermostat and safety valve inside the geyser, proper earthing, and the protective devices in your distribution board all stay exactly as important as before. A schedule is a convenience. It is not a safety device.</p>
<p>For the same reason, this is not a do-it-yourself job. Heavy-load wiring should be handled by a trained electrician who follows a safety checklist. You can read ours on the <a href="/installation">installation page</a>.</p>
<h2>Common questions</h2>
<p><strong>Will my existing switch still work?</strong> Yes. It works by hand exactly as before.</p>
<p><strong>What if the internet is down in the morning?</strong> Use the wall switch. App control returns when the connection does.</p>
<p><strong>Can the same module run my water motor or AC?</strong> The Power Module is built for those heavy loads as well. Each point is checked on its own.</p>
<p><strong>What about warranty?</strong> Homeasy modules carry a 3-year warranty against manufacturing defects.</p>
<h2>Where to begin</h2>
<p>For many families the geyser is the first thing worth making smart, because it is the one that causes the most second-guessing. Choosing a geyser smart switch is mostly about using the correct heavy-load module and fitting it safely. See the module on the <a href="/products">products page</a>, or <a href="/book-survey">book a free home survey</a> and we will check your geyser point along with the rest of the house.</p>
""")

add(
 slug="control-ac-from-phone", category="Appliances", focus_keyword="control ac from phone",
 title="How to Control AC From Phone With an IR Remote Module",
 excerpt="You can control AC from phone even if the AC is not a smart model. Here is how an IR remote module does it, and what to check in your room.",
 body="""
<p>Most air conditioners in Indian homes are ordinary remote-controlled units, not "smart" models. You can still control AC from phone with them. The trick is a small module that speaks the same language as the handset in your drawer. This guide explains how it works, where it should be placed, and what it cannot do.</p>
<h2>Two ways an AC can be controlled</h2>
<p>There are two separate things you might want to control.</p>
<ul>
<li><p><strong>The power to the AC.</strong> This is the heavy switch on the wall. Making it smart lets you cut or restore power to the unit.</p></li>
<li><p><strong>The AC's own settings.</strong> On and off, temperature, mode and fan speed. These are normally set with the remote.</p></li>
</ul>
<p>Cutting the power is not the same as setting the temperature, and an AC should normally be switched off with its remote first. So for everyday use, the second kind of control is the one that matters.</p>
<h2>How to control AC from phone using infrared</h2>
<p>Your AC remote sends commands as pulses of infrared light, which is invisible to the eye. An IR remote module can send the same pulses. Once it is set up for your AC, you tap a button in the app, the module sends the signal, and the AC responds as if you had pressed the handset.</p>
<p>The Homeasy IR Remote works with most remote-controlled ACs and TVs. Brands and models differ, so we check yours at the survey instead of promising that it works with everything.</p>
<h2>Placement matters</h2>
<p>Infrared travels in straight lines and does not pass through walls. The module must be able to "see" the front of the AC, where the receiver is. In practice that means:</p>
<ul>
<li><p>The module is placed in the same room as the AC.</p></li>
<li><p>Nothing solid sits between the two, such as a cupboard or a pillar.</p></li>
<li><p>One module serves one room. A TV in the same room can often be covered by the same module if it can see both.</p></li>
</ul>
<h2>What you can do with it</h2>
<ul>
<li><p><strong>Switch the AC on before you reach home</strong>, so the room is comfortable when you walk in.</p></li>
<li><p><strong>Switch it off after you have left</strong>, when you realise it is still running.</p></li>
<li><p><strong>Set the temperature</strong> without hunting for the remote.</p></li>
<li><p><strong>Use a schedule</strong>, for example to turn the AC off in the early morning.</p></li>
<li><p><strong>Add it to a scene</strong>, so "Good night" sets the AC, lowers the fan and turns off the lights together.</p></li>
</ul>
<p>App control needs Wi-Fi and internet. Your handset keeps working as usual, so nobody at home has to change how they use the AC.</p>
<h2>What it does not do</h2>
<p>It is better to know the limits before you buy.</p>
<ul>
<li><p>Infrared is one-way. If someone changes the AC with the handset, the app may not show the new setting.</p></li>
<li><p>It does not make the AC use less power by itself. It only makes it easier to switch off when it is not needed.</p></li>
<li><p>It cannot control an AC that has no working remote receiver.</p></li>
<li><p>Voice control through Alexa or Google is planned for Homeasy and is not available yet.</p></li>
</ul>
<h2>What about the heavy switch on the wall?</h2>
<p>The AC's power point can be made smart too, with a module built for heavy loads, the same family used for geysers and water motors. Whether you need that as well depends on how you use the AC. Many homes are happy with the IR module alone.</p>
<h2>What is checked at the survey</h2>
<ol>
<li><p>The make and model of the AC, and whether its remote signals are supported.</p></li>
<li><p>A good spot for the module with a clear view of the AC.</p></li>
<li><p>Wi-Fi reach in that room.</p></li>
<li><p>The AC's power point, if you want that controlled as well.</p></li>
</ol>
<h2>Getting started</h2>
<p>If you want to control AC from phone without replacing the AC, an IR module is the simple route. The <a href="/products">products page</a> describes the IR Remote and the Power Module, and the <a href="/app">app page</a> shows how rooms, scenes and schedules work. To check your own AC, <a href="/book-survey">book a free home survey</a>.</p>
""")

add(
 slug="home-automation-in-patna", category="Planning", focus_keyword="home automation in patna",
 title="Home Automation in Patna: A Practical Guide for Owners",
 excerpt="Planning home automation in Patna? Here is what suits local homes, what a survey checks, and the questions to ask any company before you pay.",
 body="""
<p>Interest in home automation in Patna has grown quickly, and so has the confusion. Showrooms display glass touch panels, online shops sell loose modules, and electricians each have their own opinion. This guide is for a homeowner in Patna or elsewhere in Bihar who wants a clear, practical way to think about it.</p>
<h2>What homes here are usually like</h2>
<p>A large share of homes in Patna are already built and lived in: family houses that have grown floor by floor, and flats that were finished years ago. The switchboards are in the wall, the paint is done, and nobody wants to break tiles or chase new wiring through plaster.</p>
<p>That is the starting point for any sensible plan. The question is not "what is the most advanced system?" It is "what can be added to this house without tearing it up?"</p>
<h2>Retrofit: home automation in Patna without rewiring</h2>
<p>Retrofit means fitting a compact module inside the existing switchbox, behind the switches you already have. The plates stay. The walls stay. The switches keep working by hand, and you also get control from an app.</p>
<p>This is what Homeasy does, and it is why we call ourselves retrofit-first. You can see the method on the <a href="/how-it-works">how it works</a> page. It suits lived-in homes because the work is done box by box, room by room, without a renovation.</p>
<h2>What can be made smart</h2>
<ul>
<li><p><strong>Lights and small appliances</strong>, with a smart relay.</p></li>
<li><p><strong>Ceiling fans</strong>, including speed, with a fan controller.</p></li>
<li><p><strong>Geyser, AC and water motor</strong>, with a module built for heavy loads.</p></li>
<li><p><strong>Remote-controlled ACs and TVs</strong>, with an IR remote module.</p></li>
</ul>
<p>Most families begin with the geyser, the bedrooms and the outdoor lights, then add other rooms later.</p>
<h2>What a home survey checks</h2>
<p>No two houses are wired the same way, so the first step is always a visit. A proper survey looks at:</p>
<ol>
<li><p>Each switchbox: the space inside it and the condition of the wiring.</p></li>
<li><p>Whether a neutral wire is present in the box, which some modules need.</p></li>
<li><p>The loads on each switch, so the right module is chosen.</p></li>
<li><p>Wi-Fi reach in each room, since app control needs Wi-Fi and internet.</p></li>
<li><p>Anything that should be repaired first, which you are told about before you pay.</p></li>
</ol>
<p>Our survey is free, and we survey homes across Bihar. Our head office and pilot are in Patna. The <a href="/installation">installation page</a> explains survey day and installation day.</p>
<h2>Questions to ask any company</h2>
<ul>
<li><p>Will my existing switches still work by hand?</p></li>
<li><p>Does my switchboard look different afterwards?</p></li>
<li><p>Who does the installation, and are they trained for this work?</p></li>
<li><p>Is the price written down in full, including taxes, before I decide?</p></li>
<li><p>What is the warranty, and who comes if something fails?</p></li>
<li><p>Is the company local, and can I reach a person on the phone?</p></li>
</ul>
<p>A company that answers these plainly is worth your time. One that avoids them is not, whatever the brochure says.</p>
<h2>Things to be careful about</h2>
<ul>
<li><p><strong>Big claims.</strong> "Works with every switchboard" and fixed savings percentages are easy to print and hard to prove.</p></li>
<li><p><strong>Loose modules fitted by anyone.</strong> A heavy appliance on the wrong module is a safety risk.</p></li>
<li><p><strong>No written quote.</strong> If it is not written, it will change.</p></li>
<li><p><strong>Features that are "coming".</strong> Ask what works today. For Homeasy, voice control with Alexa and Google is planned and not available yet, and we say so.</p></li>
</ul>
<h2>Where Homeasy stands today</h2>
<p>Homeasy Automation is a Patna company, incorporated in 2025. Our public launch is planned for January 2027. Until then we are inviting pilot homes in Patna to join <a href="/early-access">early access</a>, and everyone on the list gets a special early-access offer that is confirmed in a written quote before any payment.</p>
<h2>The first step</h2>
<p>Good home automation in Patna starts with a look inside your own switchboxes, not with a catalogue. <a href="/book-survey">Book a free home survey</a>, and we will tell you plainly what is possible in each room. If you would like to talk first, the <a href="/contact">contact page</a> has our phone, WhatsApp and email.</p>
""")

add(
 slug="home-automation-for-beginners", category="Guides", focus_keyword="home automation for beginners",
 title="Home Automation for Beginners: Where to Start at Home",
 excerpt="Home automation for beginners, in plain words: what it is, what to make smart first, what your home needs, and the mistakes worth avoiding.",
 body="""
<p>If the words relay, module and scene mean nothing to you yet, this is the right page. It is a guide to home automation for beginners, written for an ordinary Indian home and with no jargon left unexplained. By the end you will know what the idea is, what to start with, and what to ask before spending anything.</p>
<h2>What home automation actually is</h2>
<p>Home automation means being able to control the electrical things in your home in more ways than by walking to the switch. You can switch them from a phone, have them follow a timetable, or change several together with one tap.</p>
<p>That is all it is. The light is the same light. The fan is the same fan. Only the control is new.</p>
<h2>The four words you will hear</h2>
<ul>
<li><p><strong>Module.</strong> A small electronic part that makes one switch smart. It can sit inside the switchbox, behind your existing switch.</p></li>
<li><p><strong>App.</strong> The program on your phone where you see and control your rooms.</p></li>
<li><p><strong>Scene.</strong> One button that does several things together, such as "Good night" switching off the lights and lowering the fan.</p></li>
<li><p><strong>Schedule.</strong> A timetable, such as the geyser switching off at a set time every morning.</p></li>
</ul>
<h2>Home automation for beginners: what to make smart first</h2>
<p>You do not need to do the whole house. Start with the things that bother you most. For most families these are:</p>
<ol>
<li><p><strong>The geyser.</strong> So it is never left on by mistake.</p></li>
<li><p><strong>Bedroom lights and fans.</strong> So you can change them from bed.</p></li>
<li><p><strong>The AC.</strong> So you can switch it on before you arrive, or off after you have left.</p></li>
<li><p><strong>Outdoor and staircase lights.</strong> So they follow a timetable and nobody has to remember.</p></li>
</ol>
<p>Everything else can wait. Adding more rooms later is normal.</p>
<h2>Do you have to change your switchboards?</h2>
<p>No. This surprises most beginners. There are two methods. One replaces your switch plates with new smart panels. The other, called retrofit, keeps your plates and fits a module behind them. With retrofit your switchboard looks the same, and the switches still work by hand. The <a href="/how-it-works">how it works</a> page shows it with pictures.</p>
<h2>What your home needs</h2>
<ul>
<li><p><strong>Wi-Fi and internet</strong> for control from the app. Your switches always work by hand without them.</p></li>
<li><p><strong>Switchboxes with enough space</strong> for the modules.</p></li>
<li><p><strong>Suitable wiring.</strong> Some modules need a wire called the neutral, which not every box has.</p></li>
</ul>
<p>You do not need to check these yourself. A home survey does it, box by box.</p>
<h2>Mistakes beginners make</h2>
<ul>
<li><p><strong>Buying gadgets first.</strong> Look at your switchboxes before you buy anything.</p></li>
<li><p><strong>Treating every appliance alike.</strong> A geyser needs a module built for heavy loads. A light module must not be used on it.</p></li>
<li><p><strong>Doing mains wiring yourself.</strong> Use a trained electrician.</p></li>
<li><p><strong>Believing every claim.</strong> Ask what works today and what is only planned.</p></li>
<li><p><strong>Forgetting the family.</strong> Choose a setup that parents, children and guests can use without a phone.</p></li>
</ul>
<h2>Common questions</h2>
<p><strong>Is it safe?</strong> Fitted by trained electricians who follow a safety checklist, yes. If a wiring problem is found, you should be told before any work is done.</p>
<p><strong>What if the internet stops?</strong> You use the switches by hand, as always. App control returns with the connection.</p>
<p><strong>Can I talk to it?</strong> Voice control with Alexa or Google is planned for Homeasy and is not available yet.</p>
<p><strong>What does it cost?</strong> It depends on your rooms and appliances. An exact price needs a survey. Our <a href="/estimator">estimator</a> helps you see which modules you would need.</p>
<p><strong>Is there a warranty?</strong> Homeasy modules carry a 3-year warranty against manufacturing defects.</p>
<h2>A simple plan</h2>
<ol>
<li><p>List the three or four switches you most wish you could control from your phone.</p></li>
<li><p>Have your switchboxes and Wi-Fi checked.</p></li>
<li><p>Get a written quote for those rooms.</p></li>
<li><p>Live with it for a while, then decide what to add.</p></li>
</ol>
<p>That is the whole of home automation for beginners. When you are ready for step two, <a href="/book-survey">book a free home survey</a>. The <a href="/faq">FAQ</a> answers more questions in the meantime.</p>
""")

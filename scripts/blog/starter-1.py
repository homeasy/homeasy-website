# Starter articles 1-5 (text only). Joined into data/blog-starter.json by scripts/blog/build-starter.py
ARTICLES = []
def add(**k): ARTICLES.append(k)

add(
 slug="convert-normal-switch-to-smart-switch", category="Guides", focus_keyword="convert normal switch to smart switch",
 title="How to Convert a Normal Switch to a Smart Switch",
 excerpt="You can convert a normal switch to a smart switch without replacing the switchboard. Here is how a retrofit module does it, step by step.",
 body="""
<p>Many people type "convert normal switch to smart switch" into Google and expect the answer to be a new glass touch panel. It does not have to be. In most Indian homes the switch on the wall can stay exactly where it is. A small module goes behind it, inside the switchbox, and the same switch starts working from your phone as well.</p>
<p>This guide explains what happens inside the box, what your home needs for it, and where this method is not the right answer.</p>
<h2>What "smart" means for a switch</h2>
<p>A normal switch does one thing: it joins or breaks the circuit when you press it. A smart switch does the same job, and it can also be told to do it from somewhere else, such as an app or a schedule. Nothing about the light or the fan changes. Only the way the command reaches it changes.</p>
<p>There are two ways to get there. You can replace the whole switch plate with a smart one, or you can keep the plate and add the smart part behind it. The second way is called retrofit, and it is what Homeasy does.</p>
<h2>How to convert normal switch to smart switch with a retrofit module</h2>
<p>The work is done by a trained electrician. In simple steps:</p>
<ol>
<li><p><strong>Power off.</strong> The supply to that switchboard is switched off at the distribution board.</p></li>
<li><p><strong>Open the plate.</strong> The switch plate is unscrewed and eased forward. The wires stay connected to the house.</p></li>
<li><p><strong>Fit the module.</strong> A compact module is connected between your existing switch and the wire going to the light, fan or appliance. It sits inside the switchbox, behind the switches.</p></li>
<li><p><strong>Close and test.</strong> The plate goes back on. The switch is tested by hand first, then from the app.</p></li>
</ol>
<p>From the outside, the switchboard looks the same as it did in the morning. You can read the full process on our <a href="/how-it-works">how it works</a> page.</p>
<h2>What your home needs</h2>
<p>Retrofit is simple when three things are in place. Our free home survey checks each of them before any work is quoted.</p>
<ul>
<li><p><strong>Space in the switchbox.</strong> The module needs a little room behind the switches. Many boxes have it. Very shallow or overcrowded boxes may not.</p></li>
<li><p><strong>The right wires.</strong> Some modules need a neutral wire in the box. Many homes have one, and some older homes do not. We check every box. A no-neutral module is planned, and it is not available yet.</p></li>
<li><p><strong>Wi-Fi at home.</strong> Control from the app needs Wi-Fi and internet. Your switches keep working by hand even when the internet is down.</p></li>
</ul>
<h2>Which module does what</h2>
<p>Different loads need different modules. A light and a geyser should never be treated the same way.</p>
<ul>
<li><p><strong>Lights and small appliances:</strong> a smart relay module.</p></li>
<li><p><strong>Ceiling fans:</strong> a fan controller, so you can change speed and not only switch on and off.</p></li>
<li><p><strong>Geyser, AC and water motor:</strong> a power module built for heavy loads.</p></li>
<li><p><strong>AC and TV with a remote:</strong> an IR remote module that sends the same signals as the handset.</p></li>
</ul>
<p>The <a href="/products">products page</a> lists each one and what it controls.</p>
<h2>When retrofit is not the right answer</h2>
<p>We would rather tell you plainly than promise that it fits every home. Retrofit may not suit a switchbox that has no space left, wiring that is damaged or unsafe, or a board that needs repair anyway. In those cases the survey report says so, and any fix is agreed with you before you pay for anything.</p>
<h2>Should you do it yourself?</h2>
<p>Modules are sold online, and the wiring looks simple in a video. In a real switchbox it is easy to mix up the live and load wires, overload a small module with a heavy appliance, or leave a loose joint behind the plate. Mains wiring is not a place to learn by trial. Use a trained electrician, and ask who you can call if something stops working later.</p>
<h2>What it is like afterwards</h2>
<p>Day to day, nothing is taken away. Guests and parents use the switches as they always have. You get a few extra things: switching off a light from bed, checking from the office whether the geyser was left on, and setting a schedule for the things you forget.</p>
<p>If you want to convert normal switch to smart switch in your own home, the first step is a look inside your switchboxes. You can <a href="/book-survey">book a free home survey</a>, and we will tell you what is possible in each room. Our public launch is planned for January 2027, and until then homes can join <a href="/early-access">early access</a>.</p>
""")

add(
 slug="smart-switch-vs-normal-switch", category="Guides", focus_keyword="smart switch vs normal switch",
 title="Smart Switch vs Normal Switch: What Really Changes",
 excerpt="Smart switch vs normal switch: what is different in daily use, in wiring and in upkeep, and how a retrofit module gives you both in one.",
 body="""
<p>The question "smart switch vs normal switch" sounds like a choice between two products. In practice it is a choice about how you want to control the same light, fan or geyser. This article compares the two honestly, including the points where a normal switch is still the better tool.</p>
<h2>What each one does</h2>
<p>A normal switch is a simple mechanical part. Press it and the circuit closes. Press it again and it opens. It needs no power of its own, no network and no app, and it lasts for years.</p>
<p>A smart switch can do that same job, and it can also be operated without touching it: from an app, on a schedule, or as part of a scene such as "Good night" that turns several things off together. To do this it contains electronics, and it needs a connection to your home network.</p>
<h2>Smart switch vs normal switch in daily life</h2>
<ul>
<li><p><strong>Walking into a room.</strong> A normal switch wins. Nothing is faster than your hand. This is why a good smart setup keeps the physical switch working.</p></li>
<li><p><strong>Leaving the house.</strong> Smart wins. You can check and switch off what was left on, instead of going back upstairs or worrying on the way to work.</p></li>
<li><p><strong>Things on a timetable.</strong> Smart wins. A geyser that switches itself off, or a porch light that follows a schedule, removes a small daily chore.</p></li>
<li><p><strong>Guests, children and elders.</strong> A normal switch wins, because everybody already knows how to use it.</p></li>
<li><p><strong>When the internet is down.</strong> A normal switch is unaffected. A smart one should still work by hand; only the app control pauses.</p></li>
</ul>
<h2>What changes behind the wall</h2>
<p>There are two kinds of smart switch, and they are very different to install.</p>
<p><strong>Replacement panels</strong> take the place of your whole switch plate, often with touch buttons. They look new, and they also mean a new look for the room, a learning curve for the family, and sometimes changes to the box in the wall.</p>
<p><strong>Retrofit modules</strong> sit inside the existing switchbox, behind the switches you already have. The plate stays. The switch keeps working by hand, and the module adds control from the app. This is the method Homeasy uses, and you can see it explained on the <a href="/how-it-works">how it works</a> page.</p>
<h2>What a smart switch needs that a normal one does not</h2>
<ul>
<li><p><strong>Wi-Fi and internet</strong> for app control.</p></li>
<li><p><strong>Suitable wiring.</strong> Some modules need a neutral wire in the switchbox. A survey checks this box by box.</p></li>
<li><p><strong>The right module for the load.</strong> A light, a fan and a geyser need different modules. Putting a heavy appliance on a small module is unsafe.</p></li>
<li><p><strong>Someone to call.</strong> Electronics can fail in a way a plain switch does not. Ask about warranty and support before you buy. Homeasy modules carry a 3-year warranty against manufacturing defects.</p></li>
</ul>
<h2>Where a normal switch is still enough</h2>
<p>Not every point in a home needs to be smart. A storeroom light, a rarely used socket or a bathroom exhaust is often fine as it is. Most families start with the things they forget or cannot reach easily: the geyser, bedroom lights and fans, the AC and outdoor lights. You can add more rooms later.</p>
<h2>Do you have to choose?</h2>
<p>With retrofit you do not. The honest summary of smart switch vs normal switch is that each is better at different moments, and a module behind your existing switch gives you both: the hand switch for the moments when you are in the room, and the app for when you are not.</p>
<p>Voice control with Alexa or Google is a common reason people look at smart switches. For Homeasy it is planned and not available yet, and we will say so until it is ready. The <a href="/faq">FAQ</a> covers this and other common questions.</p>
<h2>How to decide for your home</h2>
<p>Walk through your day and note the switches you wish you could reach from somewhere else. That list is your starting point. Then have the switchboxes checked, because the wiring decides what is possible. A <a href="/book-survey">free home survey</a> does exactly that, and you get a plain answer for each room before any money changes hands.</p>
""")

add(
 slug="smart-home-without-internet", category="Guides", focus_keyword="smart home without internet",
 title="Smart Home Without Internet: What Works and What Doesn't",
 excerpt="Can you run a smart home without internet? Your switches still work by hand. Here is what stops, what keeps working, and how to plan for it.",
 body="""
<p>Internet connections drop. Routers hang, recharges lapse and lines get cut during road work. So it is fair to ask what a smart home without internet actually does. The short answer for a retrofit home: every switch keeps working by hand, and the app waits until the connection is back.</p>
<p>This article goes through it piece by piece, without pretending the internet does not matter.</p>
<h2>Three different things people call "internet"</h2>
<p>It helps to separate three things that often get mixed up.</p>
<ul>
<li><p><strong>Electricity.</strong> If the power is off, nothing electrical runs, smart or not.</p></li>
<li><p><strong>Wi-Fi.</strong> This is the local network made by your router inside the house.</p></li>
<li><p><strong>Internet.</strong> This is the line from your router to the outside world.</p></li>
</ul>
<p>Your Wi-Fi can be working while the internet is down. Both matter for app control, in different ways.</p>
<h2>What keeps working in a smart home without internet</h2>
<p>In a home fitted with Homeasy modules, the switches on your wall always work by hand. This is the main reason we retrofit behind the existing switch instead of replacing it with a screen or a touch panel. If the router is off, the recharge has run out, or the family member with the app is travelling, everyone at home can still switch a light or a fan on and off the normal way.</p>
<p>Nothing needs to be "reset" for this. The physical switch is part of the circuit, as it was before.</p>
<h2>What stops until the connection returns</h2>
<p>We say this plainly on our site: app control needs Wi-Fi and internet. While the connection is down, you cannot switch things from your phone, and you cannot check from outside whether something was left on.</p>
<p>If you see a product claiming that everything works with no network at all, ask exactly which features are meant. Being clear about this before you buy saves disappointment later.</p>
<h2>How to make outages matter less</h2>
<p>A few simple habits make the difference between a small pause and a real nuisance.</p>
<ol>
<li><p><strong>Place the router well.</strong> Smart modules sit inside metal switchboxes, and walls weaken the signal. A router in a central spot serves the far rooms better than one hidden in a corner cupboard.</p></li>
<li><p><strong>Keep the router powered.</strong> In many homes the router goes off with every power cut. Keeping it on backup power, where you have it, keeps the network steady.</p></li>
<li><p><strong>Use a reliable plan.</strong> App control does not need a fast connection. It needs one that stays up.</p></li>
<li><p><strong>Keep the switches reachable.</strong> Do not block switchboards with furniture on the assumption that the phone will do everything.</p></li>
</ol>
<h2>What about power cuts?</h2>
<p>A power cut is a different event from an internet outage. When the mains supply is off, the appliance has no power, so there is nothing to control. When the supply returns, your switches work by hand as usual. How a home behaves on inverter backup depends on its wiring, and it is one of the things we look at during the survey.</p>
<h2>Is a smart home worth it if my internet is unreliable?</h2>
<p>It can be, as long as your expectations match what you are buying. If your connection is down for hours every day, you will use the app less, and the hand switches more. You lose nothing you had before. If your connection is mostly fine with the occasional drop, a retrofit setup suits you well, because the fallback is the switch you have always used.</p>
<p>Where the idea of a smart home without internet goes wrong is with setups that remove the normal switch. Then a network problem becomes a "we cannot turn on the light" problem. Keep the physical switch, and the worst case is simply an ordinary home for a while.</p>
<h2>Questions to ask before you buy</h2>
<ul>
<li><p>Do my existing switches keep working by hand?</p></li>
<li><p>What exactly needs Wi-Fi, and what needs internet?</p></li>
<li><p>What happens after a power cut?</p></li>
<li><p>Who do I call if a module stops responding?</p></li>
</ul>
<p>You will find our answers in the <a href="/faq">FAQ</a> and on the <a href="/app">app page</a>. To see what suits your home, <a href="/book-survey">book a free home survey</a>, and we will check the switchboxes and the Wi-Fi reach room by room.</p>
""")

add(
 slug="home-automation-cost-in-india", category="Planning", focus_keyword="home automation cost in india",
 title="Home Automation Cost in India: What Decides Your Quote",
 excerpt="Home automation cost in India depends on a few clear things: points, loads, wiring and the method used. Here is how a quote is built.",
 body="""
<p>Search for "home automation cost in india" and you will find figures that differ by ten times or more. They are not all wrong. They are describing very different jobs, from a single smart plug to a full rewired villa. This article does not give you a number, because an honest number needs a look at your home. It explains what makes a quote go up or down, so you can read any quote with confidence.</p>
<h2>Why one price does not fit every home</h2>
<p>Two flats with the same number of rooms can need very different work. One has deep switchboxes with neat wiring. The other has shallow boxes, old joints and no neutral wire in half the rooms. The first is a simple retrofit. The second needs more time and perhaps some repair. A fixed price that ignores this is either padded for the worst case or will change later.</p>
<h2>The five things that decide home automation cost in India</h2>
<ol>
<li><p><strong>How many points you make smart.</strong> A "point" is one thing you control: a light, a fan, a geyser. More points mean more modules and more fitting time. You do not have to do the whole house at once.</p></li>
<li><p><strong>What kind of loads they are.</strong> A light needs a small relay. A fan needs a controller that handles speed. A geyser, AC or water motor needs a module built for heavy loads. These are different parts with different prices.</p></li>
<li><p><strong>The method.</strong> Retrofit modules go behind your existing switches, so the switchboards, wall finish and wiring stay. Replacing boards with new touch panels, or rewiring for a wired system, adds material, labour and repair work on walls.</p></li>
<li><p><strong>The state of your wiring.</strong> If a box needs a fix before a module can go in safely, that is extra work. A proper survey finds this before the quote, not after.</p></li>
<li><p><strong>What is included.</strong> Installation, app setup, taxes, warranty and support may or may not be in the headline figure. Ask.</p></li>
</ol>
<h2>What a good quote should show</h2>
<p>Whoever you buy from, a quote you can trust has these things written down:</p>
<ul>
<li><p>A room-by-room list of what will be made smart, and with which module.</p></li>
<li><p>Anything that cannot be done, and why.</p></li>
<li><p>Any wiring fix that is needed, stated before you pay.</p></li>
<li><p>The full amount including taxes.</p></li>
<li><p>The warranty period and who to contact for support.</p></li>
</ul>
<p>At Homeasy your exact price is confirmed after the free survey, and the written quote shows the full amount, including taxes, before you decide. Homeasy modules carry a 3-year warranty against manufacturing defects. Our <a href="/pricing">pricing page</a> explains the packages.</p>
<h2>Ways to keep the cost sensible</h2>
<ul>
<li><p><strong>Start with what you will use.</strong> The geyser, bedroom lights and fans, the AC and outdoor lights are the usual first choices. A storeroom bulb can wait.</p></li>
<li><p><strong>Keep your switchboards.</strong> If you like how they look and they are in good condition, retrofit avoids paying for new plates and wall repair.</p></li>
<li><p><strong>Plan in stages.</strong> Do the rooms you live in most, then add others later. Adding rooms afterwards is normal.</p></li>
<li><p><strong>Do not buy on the unit price alone.</strong> A cheap module fitted badly, with nobody to call, costs more in the end.</p></li>
</ul>
<h2>Hidden costs to ask about</h2>
<p>Some costs appear only after the work has started. Ask about each one in advance: charges for visits, charges for the app or any subscription, the cost of fixing a wall or a plate if it is damaged, and what happens if a module fails after the warranty. The Homeasy app will be free for every Homeasy customer.</p>
<h2>Get a rough idea before the survey</h2>
<p>If you want to think it through first, our <a href="/estimator">estimator</a> lets you pick your rooms and appliances and shows which modules you would need. It is a planning tool and not a quote.</p>
<h2>The honest way to get your number</h2>
<p>The only reliable answer to the question of home automation cost in india for your home is a survey followed by a written quote. Ours is free across Bihar. <a href="/book-survey">Book a free home survey</a>, and we will check every switchbox and tell you plainly what is possible and what it will cost.</p>
""")

add(
 slug="wifi-smart-switch-for-home", category="Guides", focus_keyword="wifi smart switch for home",
 title="WiFi Smart Switch for Home: How It Works and What It Needs",
 excerpt="Thinking about a wifi smart switch for home? Here is how it connects, what your router and wiring need, and what to check before you buy.",
 body="""
<p>A wifi smart switch for home use is the simplest way most families meet home automation. There is no separate control box to buy and no new wiring through the walls. The switch, or a module behind it, talks to the router you already have. This guide explains how that works and what to check before you choose one.</p>
<h2>How a Wi-Fi smart switch works</h2>
<p>Inside the switch or module there is a small relay and a Wi-Fi radio. The relay does the switching, the same job your finger does on a normal switch. The radio connects to your home router. When you tap a button in the app, the command travels over the internet to your router, then over Wi-Fi to the module, and the relay switches the light or fan.</p>
<p>That is why app control needs both Wi-Fi and internet. It is also why a well-designed setup keeps the wall switch working by hand, so a network problem never stops you from switching on a light.</p>
<h2>Two forms of wifi smart switch for home</h2>
<p><strong>A replacement switch or touch panel.</strong> The old plate comes off and a new smart plate goes on. The room gets a new look, and the family has to learn the new panel.</p>
<p><strong>A retrofit module.</strong> A compact module is fitted inside the existing switchbox, behind the switches you already have. From the outside nothing changes. This is the approach Homeasy takes, and the <a href="/how-it-works">how it works</a> page shows it step by step.</p>
<h2>What your Wi-Fi needs</h2>
<ul>
<li><p><strong>Signal in every room that has a module.</strong> Modules sit inside metal boxes in the wall, which weakens the signal. If your phone struggles for signal near a switchboard, a module there will struggle too.</p></li>
<li><p><strong>A router in a sensible place.</strong> Central and in the open is better than inside a cupboard at one end of the house.</p></li>
<li><p><strong>A steady connection.</strong> Speed matters very little. Staying connected matters a lot.</p></li>
</ul>
<p>Ask your installer which Wi-Fi settings the modules need. It is a small detail that is much easier to sort out before installation day than after.</p>
<h2>What your wiring needs</h2>
<p>Wi-Fi is only half of it. The switchbox has to suit the module.</p>
<ul>
<li><p><strong>Space.</strong> There must be room behind the switches for the module.</p></li>
<li><p><strong>A neutral wire, for some modules.</strong> Not every Indian switchbox has one. A survey checks each box.</p></li>
<li><p><strong>A module that matches the load.</strong> Lights, fans and heavy appliances such as geysers each need a different module.</p></li>
</ul>
<p>Our <a href="/products">products page</a> lists the modules for lights, fans, heavy loads and remote-controlled ACs and TVs.</p>
<h2>What you can do with it</h2>
<ul>
<li><p>Switch things on and off from the app, at home or away.</p></li>
<li><p>Group devices into rooms and scenes, such as one tap to switch off the whole bedroom.</p></li>
<li><p>Set schedules, for example a geyser that turns off by itself.</p></li>
<li><p>Share control with your family.</p></li>
</ul>
<p>Voice control through Alexa or Google is something many people ask about. For Homeasy it is planned and not available yet.</p>
<h2>Common mistakes when buying</h2>
<ol>
<li><p><strong>Buying before checking the box.</strong> A module that does not fit, or needs a wire you do not have, is money wasted.</p></li>
<li><p><strong>Using one type of module for everything.</strong> A small relay is not made for a geyser.</p></li>
<li><p><strong>Ignoring the Wi-Fi reach.</strong> Check the far rooms first.</p></li>
<li><p><strong>Losing the hand switch.</strong> Make sure the wall switch still works when the network does not.</p></li>
<li><p><strong>No support.</strong> Ask about the warranty and who comes if a module fails.</p></li>
</ol>
<h2>Is your data a concern?</h2>
<p>It is reasonable to ask what an app knows about your home. Read the privacy policy of whichever product you choose, use a strong Wi-Fi password, and share app access only with people who live with you.</p>
<h2>Where to start</h2>
<p>Choosing a wifi smart switch for home is less about brands and more about your own switchboxes and router. Start with a check of both. Our <a href="/book-survey">free home survey</a> covers the wiring in each box and the Wi-Fi reach in each room, and you get a plain list of what will work.</p>
""")

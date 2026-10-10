# BWell

**A health journey app for MBA students.**

MBA life is a constant trade-off. Recruiting events, case prep, club nights, happy hours, workouts and sleep all compete for the same hours, and the costs to your well-being are easy to ignore until you're run down. BWell helps you see those trade-offs up front. It shows what each event is likely to do for your well-being, tracks how you're doing over time, and nudges you toward a balance you're happy with.

It was built for the Kellogg MBAi hackathon.

## The idea

Every event on campus gets a **credit value**:

- **Positive credits**: events that tend to be good for you, like a workout, a sober social night, a wellness session, or a coffee chat.
- **Negative credits**: events that tend to take something out of you, like a late night of heavy drinking, a stressful interview, or a networking mixer that runs past bedtime.

Your **well-being score** (0 to 100) moves up and down with the events you choose and the days you log. A negative number doesn't mean "don't go". Some of the most important events in an MBA are a little costly. The point is to choose on purpose and keep the overall balance healthy.

## What's in the app

### Onboarding: a profile built around you
The first time you open BWell, it asks about your normal sleep, exercise and drinking. It also asks how much you care about four areas: **social, professional, academics, and health & wellness**. Your answers set your starting score and decide which events are marked as high priority for you.

### Discover: swipe through events
Events appear as cards. Swipe right to add one to your schedule, or left to skip it. Each card shows its credits, price, time, location, who's hosting, and a short explanation of why it scored the way it did. The deck mixes positive and negative picks, with events coming up soonest shown first, and can be filtered by category, setting and other options.

### Schedule: see your week
Everything you've added, laid out day by day, so you can see at a glance whether your week is balanced or tilted toward late nights and stress.

### Progress: track your journey
Your score over time, plus a daily log for sleep and workouts. Logged days move your score the same way events do. It also tracks **event money spent**, the ticket prices of the events you attend.

### Premium: find your people
A preview of matching you with students who share your interests and showing which events they're going to. In this version it's a demo and no payment is collected.

### Account
Update your preferences and routines, or reset the app.

## The events

BWell's event feed combines real and sample events:

- **Partiful**: real MBA-community events pulled from Partiful, including date, location, host and whether drinking is involved.
- **Career Management Center (CMC)** and **CampusGroups**: career, club and academic events from those platforms (sample data in this version).

Events span social, nightlife, career, academic, fitness, wellness, arts and volunteering. Each one is tagged with a category and a drinking flag, which feeds the credit calculation.

## The data and models behind the scores

### Built on real health data
BWell's scores are based on the CDC's **Behavioral Risk Factor Surveillance System (BRFSS)**, the largest ongoing health survey in the United States. We used the 2022 edition, with about **430,000 adults** after cleaning. Respondents report how many days in the past month their physical and mental health weren't good, and rate their overall health, along with their sleep, exercise, drinking, stress, social isolation and background.

### A quality-of-life score
From those answers we built a single **quality-of-life score from 0 to 100**. It blends two things equally: how many "healthy days" a person had in the past month, and how they rate their general health.

### A machine-learning model
We trained a **gradient-boosted model (XGBoost)** to predict that score from lifestyle factors: sleep, exercise, alcohol use, stress and social isolation, plus background such as age and general health indicators. We compared a few approaches, including dimensionality reduction, and kept the one that predicted best. It explains roughly 45% of the variation in people's quality-of-life scores, which is solid for a survey of this kind, where plenty of what shapes well-being isn't captured.

### From the model to event credits
The app asks the model "how would this person's score change if they spent time like this?" and turns the difference into credits.

- A **workout** raises exercise, so it earns credits, more for longer sessions.
- A **sober social event** reduces isolation, so it earns credits.
- **Drinking** and **late nights** (past 11:30 PM) cost credits.
- **Stressful events** like interviews, case prep and exams cost credits, though less than a night of heavy drinking.
- **Networking events** cost a little for the stress, and a professional event with drinking is counted as stress, not as a party.
- When several things overlap, like drinking at a late-night event, they're blended into one fair number instead of being piled on.
- Each event gets a small random "vibe check" so identical events don't always look identical, and credits are capped so no single event can swing your score too far.

Your daily sleep and workout logs go through the same model.

### Important to know
- The model finds patterns across thousands of people. It does **not** prove that one event will change your health, and the credits are estimates, not medical advice.
- Event categories and drinking flags are assigned by simple rules (keywords in the title and description), so some events will be misjudged.
- Some survey quirks carry over. For example, people who don't drink can score slightly lower than light drinkers in the data, partly because some abstain for health reasons.

## Your data
Everything you enter stays on your own device. There are no accounts. This also means your history doesn't carry over if you switch phones or browsers.

## What's next
Accounts and syncing across devices, real calendar integration, live event updates from Partiful, and real "people like you" matching.
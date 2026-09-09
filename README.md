# Server Guard AI

Build a complete, professional, hackathon-ready full-stack web application called:

"ServerShield AI"

AI-Powered Server Health Monitoring & Predictive Alert System

This application is being developed for the IBM SkillsBuild Hackathon 2026.

TEAM:

TechSentinels

TEAM MEMBERS:

- K. Sai Varshita

- G. Nanditha

- J. Sita Sravani

- E. Roshan

- S. Chandrahas

INSTITUTION:

Institute of Aeronautical Engineering (IARE)

==================================================

1. PROJECT PURPOSE

==================================================

Create an end-to-end server health monitoring platform that helps administrators monitor server resources, identify abnormal conditions, understand server health, and receive actionable alerts.

The system should monitor:

- CPU utilization

- Memory utilization

- Disk utilization

- Running processes

- System uptime

- Server status

- Resource trends

- Warning and critical conditions

The platform should convert raw server metrics into understandable health states:

HEALTHY

WARNING

CRITICAL

OFFLINE

The project should demonstrate how automation, Linux monitoring, web technologies, analytics, and AI-assisted development can be combined to solve a practical IT infrastructure problem.

IMPORTANT:

Do not create a fake-looking generic admin dashboard.

The application must clearly look like a real server monitoring product.

==================================================

2. HACKATHON REQUIREMENTS

==================================================

The application must be suitable for presentation to IBM SkillsBuild Hackathon judges.

Judges should be able to understand within a few minutes:

1. What problem is being solved

2. Why the problem matters

3. How the system works

4. What technologies are used

5. How IBM Bob was used

6. How server data is collected

7. How alerts are generated

8. What the final output looks like

9. What makes the solution useful

10. How the system can be extended in the future

Create an application that is visually polished enough for a hackathon demo.

==================================================

3. CORE PRODUCT IDEA

==================================================

The system workflow is:

LINUX SERVER

      ↓

SERVER MONITORING AGENT

      ↓

METRIC COLLECTION

      ↓

DATA VALIDATION

      ↓

HEALTH ANALYSIS

      ↓

ANOMALY / THRESHOLD DETECTION

      ↓

HEALTH CLASSIFICATION

      ↓

DATABASE

      ↓

DASHBOARD

      ↓

ALERTS

      ↓

ADMINISTRATOR ACTION

The UI should visually communicate this concept.

==================================================

4. APPLICATION MODES

==================================================

Implement two modes:

A. DEMO MODE

B. LIVE AGENT MODE

----------------------------------

A. DEMO MODE

----------------------------------

Demo Mode must work immediately without requiring a real Linux server.

Create realistic sample servers such as:

1. Production Web Server

2. Database Server

3. Application Server

4. API Server

5. Backup Server

Generate realistic changing metrics.

Do NOT make every server 0% or 100%.

Use realistic ranges such as:

CPU:

25–85%

Memory:

35–90%

Disk:

30–92%

Network:

reasonable values

Some servers should be healthy.

Some should show warning.

At least one server should occasionally show a critical condition.

The data should change periodically so the dashboard feels alive.

Add a clearly visible:

"DEMO MODE"

indicator.

----------------------------------

B. LIVE AGENT MODE

----------------------------------

Create support for a Linux monitoring agent.

Provide a shell script in the GitHub repository:

server_monitor.sh

The script should collect:

- CPU utilization

- Memory utilization

- Disk utilization

- Uptime

- Running process count

- Hostname

- Operating system information

- Timestamp

The agent should send collected information to the application's backend API.

The project should include clear instructions explaining how to run the agent.

Example concept:

./server_monitor.sh

The script should be simple and beginner-friendly.

Do not claim that live monitoring works unless the complete data flow is implemented.

==================================================

5. DASHBOARD

==================================================

Create a beautiful main dashboard.

Dashboard title:

"Server Health Command Center"

Top navigation should include:

- Dashboard

- Servers

- Metrics

- Alerts

- Analytics

- Reports

- Documentation

- Settings

Dashboard top section:

Show:

Total Servers

Healthy

Warning

Critical

Offline

Use attractive metric cards.

Example:

TOTAL SERVERS

5

HEALTHY

3

WARNING

1

CRITICAL

1

OFFLINE

0

Add small trend indicators where meaningful.

==================================================

6. SERVER HEALTH OVERVIEW

==================================================

Create a server overview section.

Each server card should display:

Server name

Server ID

IP/hostname

Operating system

Status

CPU

Memory

Disk

Uptime

Last updated time

Example:

Production Web Server

Linux Ubuntu

HEALTHY

CPU 42%

Memory 56%

Disk 61%

Last updated: 12 seconds ago

Use clear status badges.

HEALTHY = green-toned

WARNING = amber/orange-toned

CRITICAL = red-toned

OFFLINE = gray-toned

Do not use excessive colors.

Keep the overall UI professional.

==================================================

7. SERVER DETAILS PAGE

==================================================

Clicking a server should open a detailed server page.

Show:

Server identity

Health status

CPU usage

Memory usage

Disk usage

Process information

Uptime

Last heartbeat

Create historical charts for:

CPU usage

Memory usage

Disk usage

Allow time ranges:

1 Hour

6 Hours

24 Hours

7 Days

Use smooth charts.

Do not overload the page.

==================================================

8. METRIC MONITORING

==================================================

Create a Metrics page.

Allow the user to view:

CPU

Memory

Disk

Processes

Uptime

Create charts and tables.

Include:

Current value

Average

Minimum

Maximum

Trend

Example:

CPU Utilization

Current: 62%

Average: 54%

Peak: 87%

Trend: Increasing

The values should come from the backend/database when possible.

Demo mode can use generated data.

==================================================

9. HEALTH CLASSIFICATION

==================================================

Implement a configurable health classification system.

Each metric can have:

Normal

Warning

Critical

thresholds.

Example:

CPU:

Normal: below 70%

Warning: 70–85%

Critical: above 85%

Memory:

Normal: below 75%

Warning: 75–90%

Critical: above 90%

Disk:

Normal: below 75%

Warning: 75–90%

Critical: above 90%

Make thresholds configurable from Settings.

IMPORTANT:

Do not hard-code the UI to claim these are universal industry standards.

Clearly label them as:

"Configurable project thresholds"

Allow administrators to change them.

==================================================

10. AI / ANOMALY DETECTION

==================================================

The application should include an "AI-Assisted Anomaly Detection" feature.

Do not falsely claim that a complex machine-learning model exists if it is not implemented.

For the prototype, implement a transparent anomaly/risk scoring approach using:

- Recent metric values

- Moving average

- Sudden changes

- Configured thresholds

- Historical trend

Generate:

Risk Score

0–100

Example:

Risk Score: 78

Risk Level:

HIGH

Reason:

"CPU utilization increased significantly compared with the recent baseline."

Display an explanation.

Example:

WHY THIS ALERT?

• CPU increased from 48% to 89%

• Increase is above recent baseline

• Threshold crossed

• Server risk classified as HIGH

Call this:

"AI-Assisted Risk Analysis"

rather than pretending that it is a fully trained ML model.

Create the architecture so a real ML model can be integrated later.

==================================================

11. ALERT MANAGEMENT

==================================================

Create an Alerts page.

Each alert should include:

Alert ID

Server

Metric

Current value

Threshold

Severity

Time

Status

Recommended action

Example:

CRITICAL

Production Web Server

CPU Usage: 91%

Critical Threshold: 85%

Recommendation:

Investigate CPU-intensive processes and workload immediately.

Allow:

Acknowledge

Resolve

View Server

Use filters:

All

Critical

Warning

Resolved

==================================================

12. ALERT DETAILS

==================================================

Clicking an alert should show:

What happened?

Why was it detected?

Which metric crossed the threshold?

What was the previous value?

What is the current value?

What is the risk?

What should the administrator do?

Example:

EVENT

CPU utilization increased from 63% to 91%.

DETECTION

Critical threshold exceeded.

RISK

High probability of performance degradation if the condition persists.

RECOMMENDED ACTION

Check running processes and workload distribution.

==================================================

13. ANALYTICS PAGE

==================================================

Create an Analytics page.

Show:

Server health distribution

CPU trends

Memory trends

Disk growth

Alert frequency

Critical event count

Warning event count

Create charts such as:

- Line chart

- Bar chart

- Donut/pie chart where appropriate

Keep charts clean.

Add a section:

"Key Insights"

Example:

"Database Server has shown increasing memory utilization during the last 24 hours."

"Production Web Server generated 3 CPU warnings."

"Backup Server has the highest disk utilization."

These insights should be based on available data.

==================================================

14. REPORTS

==================================================

Create a Reports page.

Allow the user to generate a server health report.

Report should contain:

Report title

Generated date

Total servers

Healthy servers

Warning servers

Critical servers

Top alerts

Metric summary

Recommendations

Add:

"Generate Report"

button.

If possible allow export as PDF or CSV.

Do not create a fake download button that does nothing.

==================================================

15. SERVER REGISTRATION

==================================================

Create an "Add Server" feature.

Fields:

Server Name

Hostname / IP

Operating System

Environment

Description

Environment options:

Development

Testing

Staging

Production

After adding a server, it should appear in the dashboard.

Validate fields.

==================================================

16. SEARCH AND FILTERS

==================================================

Add global server search.

Allow filtering by:

Status

Environment

Operating System

Severity

Make filtering actually work.

==================================================

17. DOCUMENTATION PAGE

==================================================

Create a Documentation page inside the application.

Sections:

1. About the Project

2. Problem Statement

3. Solution

4. Architecture

5. Monitoring Workflow

6. Metrics

7. Health Classification

8. AI-Assisted Risk Analysis

9. IBM Bob Usage

10. Linux Agent

11. Technology Stack

12. Future Scope

This should help judges understand the project without needing the team to explain every detail.

==================================================

18. IBM BOB SECTION

==================================================

Create a dedicated section called:

"IBM Bob in Our Development Journey"

Explain honestly that IBM Bob was used as an AI-assisted development tool.

Include:

Planning

Architecture brainstorming

Code assistance

Debugging

UI refinement

Documentation

Problem solving

Testing support

Display a workflow:

IDEA

↓

IBM BOB ASSISTANCE

↓

IMPLEMENTATION

↓

HUMAN REVIEW

↓

TESTING

↓

FINAL FEATURE

Important:

Do not state that IBM Bob automatically built the complete project.

Emphasize:

"AI-assisted development with human validation."

==================================================

19. GITHUB REQUIREMENT

==================================================

The project must be structured for a public GitHub repository.

Repository name:

server-health-monitoring-ai

Recommended repository structure:

server-health-monitoring-ai/

│

├── README.md

│

├── LICENSE

│

├── docs/

│   ├── IBM_BOB_USAGE.md

│   ├── ARCHITECTURE.md

│   ├── DEMO_GUIDE.md

│   └── PROJECT_WORKFLOW.md

│

├── agent/

│   ├── server_monitor.sh

│   └── README.md

│

├── src/

│

├── public/

│

├── screenshots/

│

└── .gitignore

Make sure no passwords, API keys, tokens, or private credentials are committed.

==================================================

20. README.MD

==================================================

Generate a professional README.md.

Include:

# AI-Powered Server Health Monitoring & Predictive Alert System

Project overview

Problem statement

Solution

Objectives

Key features

System architecture

Workflow

Technology stack

Installation

How to run

Demo mode

Live agent mode

Screenshots

IBM Bob usage

Team members

Future scope

License

Also include:

"IBM SkillsBuild Hackathon 2026"

Team:

TechSentinels

Members:

K. Sai Varshita

G. Nanditha

J. Sita Sravani

E. Roshan

S. Chandrahas

Institute:

Institute of Aeronautical Engineering (IARE)

==================================================

21. IBM_BOB_USAGE.MD

==================================================

This file is EXTREMELY IMPORTANT because the hackathon submission form specifically asks for documentation showing how IBM Bob was used.

Create:

docs/IBM_BOB_USAGE.md

Include:

# How We Used IBM Bob

## 1. Project Planning

Explain how IBM Bob helped brainstorm the monitoring workflow and break the problem into components.

## 2. Architecture

Explain how IBM Bob was used to discuss architecture options and organize frontend, backend, database, monitoring agent, and analytics.

## 3. Development

Explain that IBM Bob assisted with implementation ideas, code generation, code explanation, and development guidance.

## 4. Debugging

Explain how IBM Bob helped identify and understand errors and suggest fixes.

## 5. UI/UX Improvement

Explain how IBM Bob was used to improve dashboard layout, readability, navigation, and user experience.

## 6. Documentation

Explain how IBM Bob assisted in preparing technical documentation.

## 7. Testing

Explain how IBM Bob helped identify test cases and possible edge conditions.

## 8. Human Validation

IMPORTANT:

All AI-generated suggestions were reviewed, tested, modified, and validated by the team before inclusion in the final project.

## 9. Example IBM Bob Prompts

Include examples of the actual prompts used during development.

Examples:

"Help us design a modular architecture for a Linux server health monitoring platform."

"Explain how CPU, memory, disk, uptime and process metrics can be collected using Linux shell commands."

"Help debug this server monitoring script."

"Suggest a clean dashboard layout for displaying server health."

"Review this monitoring workflow and identify possible failure cases."

Do not claim prompts were used if they were not actually used.

The team will update this document with the actual prompts and screenshots used during development.

==================================================

22. DEMO GUIDE

==================================================

Create:

docs/DEMO_GUIDE.md

The demo should be possible in approximately 3 minutes.

Recommended demo sequence:

0:00–0:20

Introduce the problem.

0:20–0:45

Show dashboard and server overview.

0:45–1:15

Open server details and show CPU/memory/disk trends.

1:15–1:45

Trigger/show a warning or critical alert.

1:45–2:10

Open alert details and show risk analysis.

2:10–2:30

Show Linux monitoring agent / workflow.

2:30–2:45

Show IBM Bob usage.

2:45–3:00

Show future scope and conclusion.

==================================================

23. UI DESIGN

==================================================

Use a professional enterprise technology design.

DO NOT use an extremely bright theme.

Use:

Deep blue / blue-charcoal background

White/light text

IBM-inspired blue accents

Cyan highlights

Subtle purple accents

Green for healthy

Amber for warning

Red for critical

The UI should feel:

Professional

Modern

Enterprise

Technical

Clean

Hackathon-ready

Avoid:

Excessive gradients

Too many colors

Huge text

Cartoon-style graphics

Unnecessary animations

Crowded dashboards

==================================================

24. TYPOGRAPHY

==================================================

Use a clean modern font.

Preferred:

Inter

Fallback:

system sans-serif

Dashboard main heading:

28–32px

Section headings:

20–24px

Card headings:

15–18px

Body:

14–16px

Small metadata:

12–13px

Make sure contrast is high enough for accessibility.

==================================================

25. RESPONSIVE DESIGN

==================================================

The application must work on:

Desktop

Laptop

Tablet

Mobile

The desktop version is the priority because it will be used for the hackathon demonstration.

==================================================

26. NAVIGATION

==================================================

Create a professional sidebar.

Logo:

ServerShield AI

Navigation:

Dashboard

Servers

Metrics

Alerts

Analytics

Reports

Documentation

Settings

At bottom:

Demo Mode / Live Mode indicator

User profile area:

TechSentinels

==================================================

27. TOP BAR

==================================================

Top bar should contain:

Page title

Search

Notification icon

Current system status

Demo/Live mode

User/team profile

==================================================

28. SETTINGS

==================================================

Create Settings page.

Sections:

Monitoring thresholds

Alert settings

Data refresh interval

Demo mode

Agent configuration

Appearance

Allow threshold configuration.

Example:

CPU Warning: 70

CPU Critical: 85

Memory Warning: 75

Memory Critical: 90

Disk Warning: 75

Disk Critical: 90

Make these values editable.

==================================================

29. DATABASE

==================================================

Use a proper backend/database if supported by the selected Lovable integration.

Suggested entities:

servers

metrics

alerts

thresholds

users/settings

Suggested server fields:

id

name

hostname

ip

os

environment

status

created_at

last_seen

Suggested metrics fields:

id

server_id

cpu_usage

memory_usage

disk_usage

process_count

uptime

timestamp

Suggested alerts fields:

id

server_id

metric

severity

value

threshold

message

recommendation

status

created_at

resolved_at

Do not expose sensitive credentials.

==================================================

30. REAL-TIME / REFRESH

==================================================

Dashboard data should update automatically.

Provide:

Auto refresh

Example:

Refresh interval:

10 seconds

Also provide a manual:

Refresh Now

button.

Display:

Last updated:

X seconds ago

==================================================

31. EMPTY STATES

==================================================

Create professional empty states.

Example:

"No servers registered yet."

"Add a server to begin monitoring."

For alerts:

"No active alerts."

"All monitored servers are operating within configured thresholds."

==================================================

32. ERROR HANDLING

==================================================

Do not allow broken pages.

Show useful messages when:

API fails

Database is unavailable

No server exists

Agent is disconnected

Invalid values are entered

Example:

"Unable to retrieve server metrics. Please check the monitoring agent connection."

==================================================

33. SECURITY

==================================================

Do not hard-code:

API keys

Passwords

Database credentials

Authentication secrets

Use environment variables / secure configuration.

Validate user inputs.

Do not expose internal secrets in frontend code.

==================================================

34. PERFORMANCE

==================================================

Keep the dashboard fast.

Avoid unnecessary API calls.

Use efficient queries.

Only load detailed historical data when needed.

==================================================

35. ACCESSIBILITY

==================================================

Ensure:

Good color contrast

Readable text

Clear buttons

Keyboard-friendly controls

Meaningful labels

Icons with accessible labels

Do not depend only on color to communicate health.

Use:

HEALTHY

WARNING

CRITICAL

OFFLINE

text labels alongside colors.

==================================================

36. VISUAL ELEMENTS

==================================================

Use visuals only where they add value.

Important visuals:

1. Server architecture diagram

2. Monitoring workflow

3. Health status cards

4. Metric charts

5. Alert visualization

6. Risk score

7. System architecture/documentation graphic

Do not fill the interface with decorative images.

==================================================

37. LANDING / ABOUT SECTION

==================================================

Create a professional About Project section.

Title:

"From Server Metrics to Actionable Intelligence"

Text:

Modern applications depend on reliable server infrastructure. Resource exhaustion, abnormal processes, and storage pressure can degrade performance and cause downtime.

ServerShield AI continuously monitors critical server metrics, identifies abnormal conditions, classifies health status, and presents actionable information through a centralized dashboard.

The platform combines automated monitoring, configurable thresholds, risk analysis, and AI-assisted development to provide a practical foundation for proactive infrastructure management.

==================================================

38. PROJECT OBJECTIVES

==================================================

Display these objectives:

1. Automate server health monitoring.

2. Detect abnormal resource utilization.

3. Reduce repetitive manual monitoring.

4. Provide clear and actionable alerts.

5. Visualize historical server trends.

6. Support proactive infrastructure management.

7. Provide a foundation for predictive analytics.

==================================================

39. FUTURE SCOPE

==================================================

Create a Future Scope section:

- Machine learning based anomaly detection

- Server failure prediction

- Capacity forecasting

- Multi-server centralized monitoring

- Cloud infrastructure monitoring

- Email/SMS/Teams notifications

- Automated remediation

- Advanced log analysis

- Role-based enterprise access

- Intelligent incident summarization

==================================================

40. HACKATHON PRESENTATION MODE

==================================================

Add a "Presentation Mode" or "Demo Mode" that makes the project easy to demonstrate.

The demo should have realistic data already available.

Add a button:

"Start Demo"

When clicked:

- Load demo servers

- Show changing metrics

- Show health statuses

- Generate sample alerts

- Show analytics

Add:

"Reset Demo"

Do not make this look fake.

Clearly label it:

DEMO DATA

==================================================

41. SAMPLE SERVERS

==================================================

Use these initial demo servers:

Production Web Server

Database Server

Application Server

API Gateway Server

Backup Server

Make their conditions different.

Example:

Production Web Server

Healthy

Database Server

Warning due to memory

Application Server

Healthy

API Gateway Server

Critical due to CPU

Backup Server

Warning due to disk

This gives the judges something meaningful to inspect.

==================================================

42. ALERT EXAMPLE

==================================================

Create realistic alert:

CRITICAL

API Gateway Server

CPU utilization reached 91%.

Configured critical threshold: 85%.

Risk:

High

Recommendation:

Inspect active processes and workload distribution. If the condition persists, consider scaling or redistributing workload.

==================================================

43. ANALYTICS INSIGHT EXAMPLES

==================================================

Generate insights based on demo data.

Examples:

"API Gateway Server currently has the highest CPU utilization."

"Backup Server has the highest disk utilization."

"Database Server memory usage is trending upward."

"Two warning conditions were detected in the current monitoring window."

Do not generate insights unrelated to the displayed data.

==================================================

44. FINAL QUALITY REQUIREMENT

==================================================

Before considering the application complete, check:

- No broken links

- No broken buttons

- No empty important pages

- No unreadable text

- No poor contrast

- No fake GitHub links

- No fake API responses presented as live data

- No fake ML claims

- No exposed credentials

- Demo Mode works

- Navigation works

- Charts render

- Alerts work

- Server details work

- Settings work

- Documentation works

- Mobile layout works

==================================================

45. FINAL HACKATHON CHECKLIST

==================================================

The finished project should clearly demonstrate:

PROBLEM

↓

SOLUTION

↓

ARCHITECTURE

↓

DATA COLLECTION

↓

MONITORING

↓

ANALYSIS

↓

ALERT

↓

ACTION

↓

FUTURE INTELLIGENCE

The application should feel like a complete product prototype rather than a simple college CRUD application.

Use polished micro-interactions, subtle animations, hover states, loading states, empty states and clear feedback.

Do not over-animate.

==================================================

46. IMPORTANT IMPLEMENTATION RULE

==================================================

Build the application incrementally and ensure every major feature actually works.

If a feature cannot be implemented fully, create a clear and honest prototype implementation rather than a non-functional placeholder.

Do not claim functionality that does not exist.

Prioritize:

1. Working dashboard

2. Working server data

3. Working metrics

4. Working alerts

5. Working health classification

6. Working demo mode

7. Working Linux agent integration

8. Working analytics

9. Documentation

10. Professional UI

==================================================

47. FINAL BRANDING

==================================================

Application name:

ServerShield AI

Tagline:

"Monitor. Detect. Understand. Act."

Team:

TechSentinels

IBM SkillsBuild Hackathon 2026

Institute:

Institute of Aeronautical Engineering (IARE)

Team members:

K. Sai Varshita

G. Nanditha

J. Sita Sravani

E. Roshan

S. Chandrahas

Use this branding consistently throughout the application.

==================================================

48. FINAL DELIVERABLE

==================================================

Create the complete working project.

Ensure the project is ready to connect to GitHub.

Ensure the repository contains:

README.md

docs/IBM_BOB_USAGE.md

docs/ARCHITECTURE.md

docs/DEMO_GUIDE.md

docs/PROJECT_WORKFLOW.md

agent/server_monitor.sh

agent/README.md

screenshots/

The final result should be suitable for:

- IBM SkillsBuild Hackathon submission

- 3-minute video demonstration

- PPT presentation

- GitHub repository review

- Live judge demonstration

Start by building the core application and database structure, then implement the dashboard, server monitoring, alerts, analytics, documentation, demo mode, and Linux agent integration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/eab46285-0b60-4ab1-bf55-418533acb786).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

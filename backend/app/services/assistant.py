import os
import google.generativeai as genai

class GeminiAssistant:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        # Ensure we don't treat placeholder strings as valid keys
        if api_key and not api_key.startswith("your_") and len(api_key) > 10:
            genai.configure(api_key=api_key)
            # Use gemini-1.5-flash or gemini-2.5-flash
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def query(self, user_question: str, context_data: str) -> str:
        """
        Executes a RAG query utilizing Gemini against active flight and telemetry context.
        """
        if not self.model:
            # High-fidelity mock responses for standard demo queries if API key is not configured
            question_lower = user_question.lower()
            
            if "ai102" in question_lower:
                if "delay" in question_lower or "30 minutes" in question_lower:
                    return (
                        "### 🕒 Impact Analysis: Flight AI102 30-Minute Departure Delay\n\n"
                        "Based on the updated weather forecast windows, delaying departure of **Flight AI102** "
                        "by 30 minutes yields the following risk impact:\n\n"
                        "| Metric | Current Schedule | Delayed Schedule | Change | Status |\n"
                        "| :--- | :---: | :---: | :---: | :---: |\n"
                        "| **Composite Risk** | **68/100** | **42/100** | 📉 -26 | **Improved** |\n"
                        "| Weather Sub-score | 85/100 | 35/100 | 📉 -50 | Clear of Cell |\n"
                        "| Aircraft Health | 75/100 | 75/100 | -- | Degraded (Watch) |\n"
                        "| Traffic / Airspace | 40/100 | 30/100 | 📉 -10 | Minor Congestion |\n\n"
                        "**Reasoning:**\n"
                        "The convective storm cell and severe wind-shear region at London Heathrow (EGLL) is expected "
                        "to shift east of the airport boundary by 17:45 UTC. The delayed arrival window (18:15 UTC) "
                        "places the flight in the clear post-storm window, dropping weather risk from **Critical** to **Low**.\n\n"
                        "**Recommendation:** Approve the 30-minute delay release. Note that aircraft health remains elevated at **75/100** "
                        "due to hydraulic pressure anomaly on tail **XY-123**; monitor pressure levels during cruise segments."
                    )
                return (
                    "### ✈️ Flight Safety Assessment: AI102\n\n"
                    "**Flight Status:** ⚠️ Elevated Risk (**68/100**)\n"
                    "**Route:** KJFK ➡️ EGLL\n"
                    "**Aircraft:** XY-123 (A320-200)\n\n"
                    "#### Risk Score Breakdown\n"
                    "*   **Weather Sub-score:** 🔴 **85/100** (Severe convective activity and wind-shear warnings at EGLL)\n"
                    "*   **Aircraft Health Sub-score:** 🟡 **75/100** (Degraded hydraulic system pressure: 2710 PSI)\n"
                    "*   **Traffic Sub-score:** 🟢 **40/100** (Routine airspace congestion)\n"
                    "*   **Human Factor Sub-score:** 🟢 **45/100** (Crew duty-time in normal parameters)\n\n"
                    "#### Explainability Analysis\n"
                    "The primary risk driver is the **Weather Intelligence** flag for Heathrow (EGLL) with severe turbulence/convective cells "
                    "coinciding with the arrival window. Additionally, **Aircraft Health Monitoring** flags a downward trend in hydraulic "
                    "pressure (2710 PSI), breaching the 2800 PSI safety limit. Combined, these factors exceed release thresholds.\n\n"
                    "#### Operational Recommendation\n"
                    "**DO NOT RELEASE** under current schedule. Inspect hydraulic seal on tail XY-123, or delay departure to clear the storm window."
                )
            
            elif "highest-risk" in question_lower or "highest risk" in question_lower or "flights today" in question_lower:
                return (
                    "### 📊 Operational Risk Snapshot: Highest-Risk Flights\n\n"
                    "Here are the active and upcoming flights currently flagged with elevated risk:\n\n"
                    "1.  **Flight AI102** (JFK ➡️ LHR) | Tail: **XY-123** | **Composite Risk: 68/100** | 🔴 *Critical Alert*\n"
                    "    *   *Drivers:* Severe convective storm forecast at arrival + hydraulic system anomaly (2710 PSI).\n"
                    "2.  **Flight SG202** (ORD ➡️ LAX) | Tail: **N456SG** | **Composite Risk: 45/100** | 🟡 *Warning Alert*\n"
                    "    *   *Drivers:* Engine EGT watch (675°C), exceeding baseline threshold.\n"
                    "3.  **Flight SG303** (JFK ➡️ MIA) | Tail: **N987SG** | **Composite Risk: 15/100** | 🟢 *Low Risk*\n"
                    "    *   *Drivers:* Standard operational parameters.\n\n"
                    "**Recommendation:** Focus operational attention on resolving release blocks for **AI102** and coordinating engineering check-ups for **SG202**."
                )
                
            elif "inspection" in question_lower or "aircraft require" in question_lower or "maintenance" in question_lower:
                return (
                    "### 🔧 Maintenance & Inspection Priority List\n\n"
                    "Two aircraft currently trigger anomalous indicators requiring maintenance inspection:\n\n"
                    "| Tail Number | Model | Status | Anomalous Parameter | Urgency | Recommendation |\n"
                    "| :--- | :---: | :---: | :--- | :---: | :--- |\n"
                    "| **XY-123** | A320-200 | 🔴 Degraded | Hydraulic Pressure (2710 PSI) | **Immediate** | Inspect seals, relief valves, and check fluid levels. |\n"
                    "| **N456SG** | B787-9 | 🟡 Watch | Exhaust Gas Temp (675°C) | **Scheduled** | Schedule engine wash and inspect turbine blades. |\n\n"
                    "Please coordinate with the ground logistics crew to assign work orders for these tails upon arrival."
                )

            return (
                "**Demo Mode (Fallback):** I am running in local fallback mode. Please configure a valid "
                "`GEMINI_API_KEY` in your `.env` file to enable conversational queries. \n\n"
                f"**Your Query:** \"{user_question}\"\n\n"
                "**Suggested Questions to Ask:**\n"
                "*   *Is Flight AI102 safe to operate?*\n"
                "*   *What if we delay departure of AI102 by 30 minutes?*\n"
                "*   *What are the highest-risk flights today?*\n"
                "*   *Which aircraft require inspection this week?*"
            )
        
        prompt = f"""
You are the SkyGuardian AI Safety Assistant, a specialized conversational safety intelligence bot.
You assist airline dispatchers, operations control centers, and safety officers in real time.

Your responses MUST be grounded ONLY in the provided database context.
If the context does not contain enough information to answer a query, politely state that you do not have that data.

Database Context (Active flights, telemetry warnings, and risk sub-scores):
---
{context_data}
---

User Question: {user_question}

Provide a concise, professional response formatted in Markdown. 
Include an explainability table or section summarizing the key numbers when answering about specific flight risks.
"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"**Gemini API Error:** {str(e)}"

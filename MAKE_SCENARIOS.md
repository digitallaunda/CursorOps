# Make.com Scenarios Discovered

**Organization ID:** 4888035
**Zone:** eu2.make.com
**Total Scenarios:** 31
**Active:** 13 | **Inactive:** 18

---

## Active Scenarios (13)

### Facebook Lead Ads → Webhooks
1. **[6999835]** Alpha proxy godrej_09 | WC
   - Type: `immediately`
   - Packages: facebook-lead-ads, builtin, http

2. **[7152107]** Orion proxy godrej_09 | WC
   - Type: `immediately` (max 2/min)
   - Packages: facebook-lead-ads, builtin, http

3. **[7130948]** orion_132 | wc
   - Type: `immediately` (max 10/min)
   - Packages: facebook-lead-ads, builtin, http

4. **[7033726]** Orion 132 Retail instent | WC
   - Type: `immediately` (max 10/min)
   - Packages: facebook-lead-ads, http

### Facebook Lead Ads → Google Sheets
5. **[6994353]** Omaxe_Centre_Point_Ghaziabad
   - Type: `immediately` (max 200/min)
   - Packages: facebook-lead-ads, google-sheets

6. **[7022780]** Property matrimony | Gaur_YXP | Instent
   - Type: `immediately` (max 10/min)
   - Packages: facebook-lead-ads, http, google-sheets

7. **[7022585]** Property matrimony | Godrej_panipat | Instent
   - Type: `immediately` (max 5/min)
   - Packages: facebook-lead-ads, builtin, http, google-sheets

8. **[6936418]** Property matrimony | Lodha | Instent
   - Type: `immediately` (max 100/min)
   - Packages: facebook-lead-ads, http, google-sheets

9. **[7022686]** Property matrimony | L&T_YXP | Instent
   - Type: `immediately` (max 10/min)
   - Packages: facebook-lead-ads, http, google-sheets

10. **[7022204]** Property matrimony | Pallavaram_Gardens | Instent
    - Type: `immediately` (max 10/min)
    - Packages: facebook-lead-ads, http, google-sheets

11. **[6974570]** Property matrimony | Raintree Park - Phase 2 | Instent
    - Type: `immediately` (max 100/min)
    - Packages: facebook-lead-ads, http, google-sheets

12. **[7022348]** Property matrimony | Sattva_Hemlet | Instent
    - Type: `immediately` (max 10/min)
    - Packages: facebook-lead-ads, http, google-sheets

### Data Integration
13. **[7339742]** Integration Google Sheets, Airtable
    - Type: `on-demand`
    - Packages: google-sheets, airtable

---

## Usage

```bash
# List all scenarios
./scripts/make-list-scenarios.sh

# List active only
./scripts/make-list-scenarios.sh active

# List inactive only
./scripts/make-list-scenarios.sh inactive

# Show summary
./scripts/make-list-scenarios.sh summary

# Run a specific scenario
./scripts/make-run.sh 7339742 '{}'
```

---

## Statistics

**Most Common Packages:**
- facebook-lead-ads (used in 24 scenarios)
- http (used in 21 scenarios)
- google-sheets (used in 19 scenarios)
- airtable (used in 6 scenarios)
- builtin (used in 6 scenarios)

**Scheduling Types:**
- immediately: 12 scenarios
- on-demand: 9 scenarios
- indefinitely: 6 scenarios
- daily: 1 scenario
- other: 3 scenarios

**Total Operations:** 23,951
**Total Data Transfer:** ~34 MB

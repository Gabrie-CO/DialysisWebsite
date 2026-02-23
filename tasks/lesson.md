# Lessons Learned

- **Dashboard vs. Queue**: The "Patient Queue" is not a separate page (there is no `/queue` route). It is a section at the bottom of the main dashboard (`/`). 
- Patients assigned to chairs appear in the "Treatment Area" of the dashboard, whereas patients who are waiting but not yet in chairs appear in the "Patient Queue" section.
- **Queue Requirements**: To be visible in the Patient Queue:
  1. The patient must have a meeting record with today's date exactly formatted as `YYYY-MM-DD`.
  2. The status of that meeting must be `"active"` or `"scheduled"`.
  3. The patient must **not** be assigned to a chair on the dashboard.
- **Queue vs Chairs Initialization**: During initialization or seeding, do not assign patients to chairs (`chairId`) if the intention is to populate the "Patient Queue". Setting a chair ID immediately hides the patient from the pending queue.
- **Queue Block Advancing**: The Patient Queue should automatically advance to showing the next active block *only* when the current block's queue is completely empty. We do not need to wait for the current block's chairs to be empty as long as their queue is cleared.

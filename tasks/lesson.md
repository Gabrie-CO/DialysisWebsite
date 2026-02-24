# Lessons Learned

- **Dashboard vs. Queue**: The "Patient Queue" is not a separate page (there is no `/queue` route). It is a section at the bottom of the main dashboard (`/`).
- Patients assigned to chairs appear in the "Treatment Area" of the dashboard, whereas patients who are waiting but not yet in chairs appear in the "Patient Queue" section.
- **Queue Requirements**: To be visible in the Patient Queue:
  1. The patient must have a meeting record with today's date exactly formatted as `YYYY-MM-DD`.
  2. The status of that meeting must be `"active"` or `"scheduled"`.
  3. The patient must **not** be assigned to a chair on the dashboard.
  4. The meeting record must have a valid `block` number assigned (e.g., `block: 1`).
- **Queue vs Chairs Initialization**: During initialization or seeding, do not assign patients to chairs (`chairId`) if the intention is to populate the "Patient Queue". Setting a chair ID immediately hides the patient from the pending queue.
- **Queue Data Source Caution**: The patient queue is driven entirely by the `meetings` table. **Never** query the `patients` table for fields like `block` or `present` to determine queue visibility. Those properties are tracked on the individual daily `meeting` record. The backend should return the full valid queue and map the `block` directly from the `meetings` record, allowing the frontend to handle the `activeBlock` slicing.
- **Queue Block Advancing**: The Patient Queue should automatically advance to showing the next active block _only_ when the current block's queue is completely empty. We do not need to wait for the current block's chairs to be empty as long as their queue is cleared.
- **Convex Bundling & Type Imports**: When importing types from Convex's generated `dataModel`, always use the top-level `import type` syntax (e.g., `import type { Id } from "./_generated/dataModel"`). Using value-import syntax with inline type modifiers (`import { type Id } from ...`) can cause Esbuild to fail during `npx convex dev`, because it attempts to resolve a non-existent `./_generated/dataModel.js` runtime file.
- **Valid Meeting Object Example**: A well-formed meeting object for the queue looks like this:
  ```javascript
  {
    _creationTime: 1771908060520.5212,
    _id: "j970qnp3zhgyke6zk50amrmy0581rmax",
    block: 1,
    clinicId: "k577r3bz52m3fadwp976391qkx81q8c0",
    condition: "Stable",
    date: "2026-02-24", // Exact YYYY-MM-DD format
    patientId: "j578wnqhnb1e7b10bc371d7wwx81s8tj",
    status: "scheduled",
    // Notice: NO chairId is set initially if they are in the queue
  }
  ```
- **Svelte/Convex Race Conditions**: When performing a multi-step action like discharging a patient (e.g., mark as completed, remove from chair, change chair to cleaning), **do not** fire multiple sequential `convex.mutation` calls from the Svelte frontend. Because Convex is a real-time reactive database, rapid-fire mutations will trigger interleaved state updates, leading to race conditions where older states overwrite newer ones (like a patient remaining technically `"active"` despite a `"completed"` call). Instead, wrap the entire multi-step process into a **single, backend atomic mutation** (like `dischargePatient`).
- **Dynamic Block Propagation logic**: The block advancing logic in Svelte should derive its "Is Current Block Empty" state _only_ from the unassigned queue array, not from active chairs. By using `Array.from(new Set(rawQueue.map(p => p.block)))` and sorting it, the system can determine precisely which block is the _next_ block with waiting patients, and assign `activeBlock` dynamically without requiring blocks to empty strictly 1->2->3.
- **Interleaving State for the UI**: When Svelte components expect a unified array (like `getDailyChairs` populating the dashboard chairs), but some elements exist in different DB tables (like `"cleaning"` chairs existing independently from valid `"patient"` assignments), format the alternate data sources in the backend to match the frontend Svelte shape (e.g., creating a "mock patient" object for a cleaning chair). This eliminates the need for complex frontend reconciliations.
- **Seeding for Edge Cases**: The seed script `seedClinicsAndMeetings` correctly generates patients across all 3 `block` numbers, confirming that Svelte accurately renders empty chairs, pulls queue data, dynamically moves block states, and correctly matches block number types (`p.block === 1` vs string `"1"`).

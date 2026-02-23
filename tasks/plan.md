# Migrate Daily Chairs to Clinics Plan

- [ ] Add `clinics` table to `convex/schema.ts` with `activeChairs` property.
- [ ] Implement `getDailyChairs` query in `convex/clinics.ts` that populates `activeChairs` with patient info.
- [ ] Implement `assignChair` mutation in `convex/clinics.ts` that manages the `clinics` row (and logs to meetings).
- [ ] Update `src/routes/+page.svelte`:
  - Change `useQuery(api.meetings.getDailyChairs)` to `useQuery(api.clinics.getDailyChairs)`.
  - Change mutations calling `api.meetings.assignChair` to `api.clinics.assignChair`.
- [ ] Run typescript checks.
- [ ] Verify functionality (manual Drag & Drop in UI).

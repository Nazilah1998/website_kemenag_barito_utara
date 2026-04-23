# TODO - Homepage Slider + Admin CRUD

- [x] 1. Add DB schema for `homepage_slides` in `docs/schema.sql`
- [x] 2. Create library `src/lib/homepage-slides.js` for public/admin queries
- [x] 3. Create admin APIs:
  - [x] `src/app/api/admin/homepage-slides/route.js`
  - [x] `src/app/api/admin/homepage-slides/[id]/route.js`
- [x] 4. Create admin UI:
  - [x] `src/app/admin/homepage-slides/page.jsx`
  - [x] `src/components/admin/AdminHomepageSlidesManager.jsx`
- [x] 5. Update permissions and admin navigation:
  - [x] `src/lib/permissions.js`
  - [x] `src/components/admin/AdminSidebar.jsx`
  - [x] `src/components/admin/AdminHeader.jsx`
- [x] 6. Create homepage section slider:
  - [x] `src/components/HomepageSlidesSection.jsx`
  - [x] integrate into `src/app/page.js`
- [ ] 7. Run critical-path testing and fix issues

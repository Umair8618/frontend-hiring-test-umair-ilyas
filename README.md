# Turing Technologies Frontend Engineer Test

**Candidate:** Umair Ilyas  
**Date:** 16 June 2025

---

## Project Overview

This project is a Next.js application implementing a call management dashboard as part of the Frontend Engineer technical test for Turing Technologies.

The app fetches, displays, filters, and manages call records with features such as pagination, real-time updates, note-taking, and archiving/unarchiving calls.

---

## Technologies Used

- **Next.js 15.3.3** - React framework for server-side rendering and routing  
- **TypeScript** - Static typing for safer and clearer code  
- **Tailwind CSS** - Utility-first CSS framework for styling  
- **Ant Design** - UI component library for React  
- **Apollo Client** - GraphQL client for data fetching and caching  
- **Moment.js** - Date formatting and manipulation  
- **GraphQL API** - Backend API for calls data, mutations, and subscriptions

---

## Features

- **Paginated Call Listing:** Fetch calls with pagination and display in a table  
- **Filter Calls:** Filter calls by status (All, Archived, Unarchived)
- **Add Notes:** Add notes to individual calls via a modal popup  
- **Batch Archive/Unarchive:** Select multiple calls and archive/unarchive them with confirmation  
- **Real-Time Updates:** Subscribes to call updates to refresh data live  
- **Optimistic UI & Cache Updates:** Ensures UI stays in sync with backend changes  

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Umair8618/frontend-hiring-test-umair-ilyas.git
   cd frontend-hiring-test-umair-ilyas

2. Install dependencies:
    npm install
    # or
    yarn install

3. Run the development server:
    npm run dev
    # or
    yarn dev

4. Open http://localhost:3000 in your browser.


## Usage
- Use the filter dropdown to view All, Archived, or Unarchived calls
- Select calls using checkboxes to batch archive/unarchive
- Click "Add Note" button on a call row to open a modal and add notes
- Pagination controls are at the bottom to navigate through calls

## Notes
- The app uses Apollo Client's cache and update functions to keep UI in sync after mutations
- Error and success messages use Ant Design's message system
- The app uses Avenir font as per design requirements

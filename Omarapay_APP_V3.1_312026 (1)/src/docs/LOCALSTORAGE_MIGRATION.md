# LocalStorage Migration & Data Guide

This document outlines the current data structure used for the `omara-payments` application in **LocalStorage Mode** and provides guidelines for future migration to a backend database (like Supabase).

## Current Architecture

The application is currently configured to use `localStorage` for persisting Business and Merchant data. This allows for a fully functional frontend experience without requiring an active database connection for business logic.

### Storage Keys

| Key | Description | Format |
|---|---|---|
| `omara_businesses` | List of all registered business profiles | JSON Array of Objects |
| `omara_selected_business` | ID of the currently active business | UUID String |
| `omara_account_type` | Current user context (`personal` vs `business`) | String |

## Data Schema

### Business Object (`omara_businesses`)

Each item in the array follows this structure:
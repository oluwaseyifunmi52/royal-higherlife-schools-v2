// ─────────────────────────────────────────────────────────────────────────────
// Royal Higher Life Schools — Shared class configuration (frontend).
// Mirrors server/config/classes.js so the UI never hardcodes class names.
// ─────────────────────────────────────────────────────────────────────────────

export const CLASS_CATEGORIES = {
    Children: ['Creche', 'Nursery 1', 'Nursery 2', 'Kindergarten 1', 'Kindergarten 2'],
    Primary: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
    'Junior Secondary': ['JSS 1', 'JSS 2', 'JSS 3'],
    'Senior Secondary': ['SS 1', 'SS 2', 'SS 3'],
}

export const CLASS_CATEGORIES_LIST = Object.keys(CLASS_CATEGORIES)

export const ALL_CLASSES = Object.values(CLASS_CATEGORIES).flat()

export function getClassesByCategory(category) {
    return CLASS_CATEGORIES[category] || []
}

export function getAllClasses() {
    return [...ALL_CLASSES]
}

export function getClassCategories() {
    return CLASS_CATEGORIES_LIST
}

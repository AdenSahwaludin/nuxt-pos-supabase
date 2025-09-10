# Category Management System Documentation

## Overview

This document describes the comprehensive Category Management system for the Nuxt POS application. The system provides full CRUD operations for managing product categories with advanced features like bulk actions, export functionality, and detailed analytics.

## Features

### ✅ Core Features

- **Full CRUD Operations**: Create, Read, Update, Delete categories
- **Search & Filter**: Real-time search by category name
- **Advanced Sorting**: Sort by name, product count, or last updated
- **Pagination**: Display 10/25/50 items per page
- **Bulk Actions**: Multi-select categories for bulk operations
- **Export**: Export data to CSV/Excel format
- **Validation**: Unique category names with minimum 3 characters
- **Toast Notifications**: Success/error feedback for all actions
- **Confirmation Dialogs**: Safety confirmation before deletions

### 📊 Analytics Features

- **Product Count**: Number of products in each category
- **Total Assets**: Sum of (stock × price) for all products in category
- **Last Updated**: Timestamp tracking for category modifications
- **Stock Status**: Safety analysis (safe/low/empty stock)

### 🎨 UI/UX Features

- **Empty State**: Illustrated empty state with call-to-action
- **Loading States**: Smooth loading indicators
- **Responsive Design**: Mobile-friendly interface
- **Detail View**: Click category row to view detailed product list
- **Status Indicators**: Visual stock status indicators

## File Structure

```
app/
├── pages/admin/kategori/
│   └── index.vue                 # Main category management page
├── components/
│   ├── KategoriCreateModal.vue   # Create category modal
│   ├── KategoriEditModal.vue     # Edit category modal
│   └── KategoriDetailModal.vue   # Category detail view modal
sql/
├── kategori_policies.sql         # Database RLS policies
testing/
└── testKategori.js              # Test script for category operations
```

## Database Schema

```sql
CREATE TABLE sbs.kategori (
  id_kategori smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama varchar(100) NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products reference categories
ALTER TABLE sbs.produk
ADD COLUMN id_kategori smallint REFERENCES sbs.kategori(id_kategori);
```

## API Operations

### Read Categories with Analytics

```javascript
const { data, error } = await supabase
  .schema("sbs")
  .from("kategori")
  .select("id_kategori, nama, created_at, updated_at");

// Calculate derived fields
const categoriesWithStats = await Promise.all(
  data.map(async (kategori) => {
    const { data: products } = await supabase
      .schema("sbs")
      .from("produk")
      .select("harga, stok")
      .eq("id_kategori", kategori.id_kategori);

    return {
      ...kategori,
      jumlah_produk: products?.length || 0,
      total_aset:
        products?.reduce(
          (total, produk) => total + produk.harga * produk.stok,
          0
        ) || 0,
    };
  })
);
```

### Create Category

```javascript
const { data, error } = await supabase
  .schema("sbs")
  .from("kategori")
  .insert([
    {
      nama: categoryName.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ])
  .select()
  .single();
```

### Update Category

```javascript
const { data, error } = await supabase
  .schema("sbs")
  .from("kategori")
  .update({
    nama: newName.trim(),
    updated_at: new Date().toISOString(),
  })
  .eq("id_kategori", categoryId)
  .select()
  .single();
```

### Delete Category

```javascript
// Single delete
const { error } = await supabase
  .schema("sbs")
  .from("kategori")
  .delete()
  .eq("id_kategori", categoryId);

// Bulk delete
const { error } = await supabase
  .schema("sbs")
  .from("kategori")
  .delete()
  .in("id_kategori", selectedIds);
```

## Component Usage

### Main Page

```vue
<template>
  <!-- Category management interface -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header with search, filters, export -->
    <!-- Categories table with pagination -->
    <!-- Bulk action controls -->
  </div>
</template>
```

### Create Modal

```vue
<KategoriCreateModal
  v-if="showCreateModal"
  @close="closeCreateModal"
  @created="handleCategoryCreated"
/>
```

### Edit Modal

```vue
<KategoriEditModal
  v-if="showEditModal && selectedCategory"
  :kategori="selectedCategory"
  @close="closeEditModal"
  @updated="handleCategoryUpdated"
/>
```

### Detail Modal

```vue
<KategoriDetailModal
  v-if="showDetailModal && selectedCategory"
  :kategori="selectedCategory"
  @close="closeDetailModal"
/>
```

## Validation Rules

### Category Name

- **Required**: Yes
- **Minimum Length**: 3 characters
- **Uniqueness**: Must be unique across all categories
- **Trimming**: Automatic whitespace trimming

### Error Handling

- Duplicate name detection with real-time validation
- Network error handling with user-friendly messages
- Form validation with inline error display

## Security & Permissions

### Row Level Security (RLS)

- Enabled on `sbs.kategori` table
- Authenticated users can perform all operations
- Application-level role checking for admin-only operations

### Access Control

```sql
-- Allow authenticated users to read/write categories
GRANT ALL ON sbs.kategori TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE sbs.kategori_id_kategori_seq TO authenticated;
```

## Export Functionality

### CSV Export

```javascript
const exportData = async () => {
  const csvData = categories.map((kategori) => ({
    "Nama Kategori": kategori.nama,
    "Jumlah Produk": kategori.jumlah_produk,
    "Total Aset": kategori.total_aset,
    "Terakhir Diperbarui": formatDate(kategori.updated_at),
  }));

  downloadCSV(csvData, "kategori-export.csv");
};
```

## Testing

### Run Tests

```bash
# Test category operations
node testing/testKategori.js
```

### Test Coverage

- ✅ Create category
- ✅ Read categories with pagination
- ✅ Update category
- ✅ Delete category (single & bulk)
- ✅ Search functionality
- ✅ Validation (uniqueness, length)
- ✅ Product statistics calculation

## Performance Considerations

### Optimization Strategies

- **Pagination**: Limit results to prevent large data loads
- **Debounced Search**: 300ms delay to reduce API calls
- **Efficient Queries**: Separate queries for count and data
- **Lazy Loading**: Modal components loaded on demand

### Caching Strategy

- Client-side state management with reactive updates
- Immediate UI updates with optimistic responses
- Background data refresh after mutations

## Future Enhancements

### Planned Features

- [ ] Category hierarchy (parent/child relationships)
- [ ] Category images and descriptions
- [ ] Advanced analytics dashboard
- [ ] Bulk import from CSV/Excel
- [ ] Category templates and presets
- [ ] Integration with inventory alerts

### Performance Improvements

- [ ] Server-side pagination with cursor-based navigation
- [ ] Real-time updates with WebSocket connections
- [ ] Advanced caching with service workers
- [ ] Background sync for offline capability

## Troubleshooting

### Common Issues

**Categories not loading**

- Check Supabase connection
- Verify RLS policies are enabled
- Ensure user is authenticated

**Create/Update failing**

- Verify unique name constraint
- Check minimum length validation
- Ensure proper error handling

**Export not working**

- Check browser file download permissions
- Verify CSV conversion logic
- Test with smaller datasets

### Debug Mode

```javascript
// Enable debug logging
console.log("📝 Category operation:", operation, data);
```

## Dependencies

### Required Packages

- `@supabase/supabase-js`: Database operations
- `lucide-vue-next`: Icons
- `vue`: Framework
- `nuxt`: Meta framework

### Browser Support

- Modern browsers with ES2015+ support
- Mobile browsers with touch events
- File download API support for export

## Migration Guide

### From Legacy System

1. Export existing categories to CSV
2. Run database migration scripts
3. Import categories using bulk import
4. Update product references
5. Test all functionality

### Database Migration

```sql
-- Migrate from old string-based categories
INSERT INTO sbs.kategori (nama)
SELECT DISTINCT kategori FROM sbs.produk
WHERE kategori IS NOT NULL;

-- Update product references
UPDATE sbs.produk p
SET id_kategori = k.id_kategori
FROM sbs.kategori k
WHERE p.kategori = k.nama;
```

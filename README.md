# Ordboka - Dictionary App

A modern Vue.js dictionary application that fetches data from Google Sheets and deploys to GitHub Pages.

## Features

- 📚 Browse dictionary entries
- 🔍 Real-time search functionality
- ☁️ Data sourced from Google Sheets
- 📱 Responsive design
- 🚀 Deployed on GitHub Pages

## Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure Google Sheets

1. Create a Google Sheets document with the following columns:

   - Column A: **Word**
   - Column B: **Definition**
   - Column C: **Example** (optional)

2. Make your sheet publicly viewable:

   - Go to Share → Change to "Anyone with the link can view"

3. Get your Sheet ID from the URL:

   ```text
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

4. Update the configuration in `src/services/googleSheets.js`:

   ```javascript
   const SHEET_ID = "your-actual-sheet-id-here";
   const SHEET_NAME = "Sheet1"; // Change if your sheet has a different name
   ```

### 3. Update GitHub Pages Configuration

Update the `base` property in `vite.config.js` to match your repository name:

```javascript
export default defineConfig({
  base: "/your-repo-name/", // Replace with your actual repo name
  // ... other config
});
```

Also update the router base in `src/main.js`:

```javascript
const router = createRouter({
  history: createWebHistory("/your-repo-name/"), // Match your repo name
  routes,
});
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The app automatically deploys to GitHub Pages when you push to the main branch using GitHub Actions.

### Manual Deployment

```bash
# Build and deploy manually
npm run build
npm run deploy
```

## Project Structure

```text
src/
├── components/
│   ├── Home.vue          # Landing page
│   └── Dictionary.vue    # Main dictionary interface
├── services/
│   └── googleSheets.js   # Google Sheets integration
├── App.vue               # Root component
├── main.js              # App entry point
└── style.css            # Global styles
```

## Google Sheets Integration

The app supports multiple methods to fetch data from Google Sheets:

1. **CSV Export** (recommended): Works with public sheets
2. **JSON Export**: Fallback method
3. **Google Sheets API**: Requires API key (optional)

### Sample Sheet Structure

| Word  | Definition                           | Example                        |
| ----- | ------------------------------------ | ------------------------------ |
| Hello | A greeting or expression of goodwill | Hello, how are you today?      |
| Vue   | A progressive JavaScript framework   | We built this app using Vue.js |

## Configuration Options

### Environment Variables

You can optionally set these environment variables:

- `VITE_GOOGLE_SHEETS_ID`: Your Google Sheets ID
- `VITE_GOOGLE_API_KEY`: Google Sheets API key (optional)

### Customization

- **Styling**: Modify the CSS in components or `src/style.css`
- **Data Structure**: Update the parsing logic in `googleSheets.js`
- **Features**: Add new components in the `src/components/` directory

## Troubleshooting

### Common Issues

1. **Data not loading**: Ensure your Google Sheet is publicly accessible
2. **404 on refresh**: GitHub Pages doesn't support client-side routing by default
3. **CORS errors**: Make sure you're using the CSV export method for public sheets

### Support

- Check the browser console for error messages
- Verify your Google Sheets configuration
- Ensure the sheet has the correct column structure

## Technologies Used

- Vue.js 3
- Vue Router
- Vite
- Axios
- GitHub Pages
- GitHub Actions

## License

MIT License - feel free to use this project as a starting point for your own dictionary application!

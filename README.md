# Winter Holiday Movie Tracker

A comprehensive web application for tracking and rating winter holiday movies from multiple cultural celebrations including Christmas, Hanukkah, Kwanzaa, New Years, Winter Solstice, Noche Buena, and Las Posadas.

## Features

- **100 Curated Movies**: A diverse collection of classic and modern holiday films from various genres
- **Multiple Holiday Celebrations**: Movies tagged for Christmas, Hanukkah, Kwanzaa, New Years, Winter Solstice, Noche Buena, and Las Posadas
- **Smart Recommendations**: Personalized movie suggestions based on your ratings and preferences
- **Local Storage**: All your ratings and viewing history are saved in your browser
- **Star Rating System**: Rate movies from 1-5 stars
- **Watch Tracking**: Mark movies as watched or not yet seen
- **Advanced Filtering**: Filter by holiday, genre, theme, and watch status
- **Search Functionality**: Search movies by title, description, holiday, or theme
- **Sorting Options**: Sort by title, year, or rating
- **Live Statistics**: Track total movies, watched count, and average rating
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices

## Movie Categories

The collection includes movies for:

- **Christmas**: 70+ movies from classics like "It's a Wonderful Life" to modern favorites like "Klaus"
- **Hanukkah**: Films celebrating Jewish culture and traditions
- **New Years**: Movies set around New Year's Eve celebrations
- **Kwanzaa**: Films highlighting African American culture and values
- **Winter Solstice**: Winter-themed movies and stories
- **Noche Buena**: Latin American Christmas Eve traditions
- **Las Posadas**: Mexican holiday celebration films

## Movie Metadata

Each movie includes:
- Title and release year
- Associated holidays
- Genre classification
- Multiple theme tags
- Detailed description

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Modern responsive design with CSS Grid and Flexbox
- **Vanilla JavaScript**: ES6+ features including classes, async/await, and localStorage
- **JSON**: Movie data storage

## Usage

### Viewing Movies

Browse the complete collection with beautiful card-based layouts. Each card displays:
- Movie title and year
- Holiday tags
- Theme tags
- Genre
- Description
- Your rating
- Watch status

### Rating Movies

1. Click on any star (1-5) to rate a movie
2. Click the same star rating to remove your rating
3. Rating a movie automatically marks it as watched

### Tracking Watch Status

- Click "Mark as Watched" to log that you've seen the movie
- Click "Mark as Unwatched" to remove from your watched list
- Marking as unwatched also clears your rating

### Filtering and Searching

Use the filter panel to narrow down movies by:
- **Holiday**: Filter by specific holiday celebration
- **Genre**: Filter by movie genre (Comedy, Drama, Animation, etc.)
- **Theme**: Filter by themes (Family, Romance, Musical, etc.)
- **Status**: View only watched, unwatched, or rated movies
- **Search**: Free-text search across title, description, and tags

### Sorting

Sort your filtered results by:
- Title (A-Z or Z-A)
- Year (Newest or Oldest first)
- Rating (Highest or Lowest first)

### Smart Recommendations

The app features an intelligent recommendation system that suggests unwatched movies based on your ratings:

- **Automatic Activation**: Recommendations appear when you rate movies 4-5 stars
- **Personalized Suggestions**: Up to 6 movies recommended based on your preferences
- **Match Percentage**: See how well each recommendation matches your taste
- **Smart Algorithm**: Analyzes your preferences across multiple dimensions:
  - **Genres** (30% weight): Suggests movies in genres you've rated highly
  - **Themes** (40% weight): Matches thematic elements you enjoy
  - **Holidays** (20% weight): Recommends movies from holidays you prefer
  - **Decades** (10% weight): Considers your preferred film eras
- **Clear Explanations**: Each recommendation shows why it was suggested
- **Interactive Cards**: Rate or mark recommendations as watched directly from the suggestion

The more movies you rate, the better the recommendations become!

## GitHub Pages Deployment

This application is optimized for GitHub Pages deployment:

1. All files use relative paths
2. No server-side dependencies required
3. Pure client-side application
4. JSON data loads via fetch API

### Deployment Steps

1. Push all files to your GitHub repository
2. Go to Settings > Pages
3. Select your branch (e.g., `claude/holiday-movie-tracker-*`)
4. Select root directory
5. Click Save
6. Your site will be live at `https://yourusername.github.io/repositoryname/`

## Data Persistence

All user data (ratings and watch status) is stored in browser localStorage:
- Data persists across sessions
- No account or login required
- Data is private to your browser
- Use "Clear All Data" button to reset

## Browser Compatibility

Works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## File Structure

```
.
├── index.html      # Main HTML structure
├── styles.css      # CSS styling
├── app.js          # JavaScript functionality
├── movies.json     # Movie database
└── README.md       # Documentation
```

## Movie Collection Highlights

The collection includes:
- Classic films from the 1940s-1980s
- Modern favorites from 2000-2024
- Animated features for families
- Romantic comedies
- Action movies with holiday settings
- Horror films for alternative holiday viewing
- Documentaries and cultural celebrations
- LGBTQ+ inclusive holiday stories
- Diverse cultural representations

## Future Enhancements

Potential features for future versions:
- Export/import watch history
- Movie recommendations based on ratings
- Social sharing capabilities
- Additional holiday celebrations
- Movie trailers integration
- Streaming service availability

## Credits

Movie data compiled from various public sources. This is a personal tracking tool and does not claim any rights to movie titles or descriptions.

## License

This project is open source and available for personal use.

---

**Happy Holiday Movie Watching!**

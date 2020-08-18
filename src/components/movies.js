import React, { Component } from 'react';
import Pagination from '../common/Pagination';
import { getMovies } from '../services/fakeMovieService'
import { paginate } from '../utils/paginate'
import { getGenres } from '../services/fakeGenreService';
import ListGroup from '../common/ListGroup'
import MoviesTable from './moviesTable';
import _ from 'lodash'


class Movies extends Component {
    state = {
      allMovies: [],
      pageSize: 4,
      currentPage: 1,
      genres: [], 
      sortColumn: { path: 'title', order :'asc' },
      name: 'title'
    
    }
    
    componentDidMount() {
      const genres = [{ _id:'', name: 'All Genres' }, ...getGenres()]

      this.setState({ allMovies: getMovies(), genres })
    }


    handleDelete = (movie) => {
      this.setState({ allMovies : this.state.allMovies.filter(e => e._id !== movie._id)})
    }

    handlePageChange = page => {
    this.setState({ currentPage: page })
    }

    handleLike = movie => {
    const movies = [...this.state.allMovies];
    const index = movies.indexOf(movie)
    movies[index] = { ...movies[index] }
    movies[index].liked = !movies[index].liked
    this.setState({ allMovies: movies })
   }

    handleGenreSelect = genre => {
      this.setState({ selectedGenre: genre, currentPage: 1 })
    } 
  
    handleSort = path => {
      this.setState({ sortColumn: { path , order: 'asc'} })
    }


    render() {
      const {length: count} = this.state.allMovies;
      const { allMovies, currentPage, pageSize, selectedGenre, genres, sortColumn } = this.state; 

      const filtered = selectedGenre && selectedGenre._id
          ? allMovies.filter(e => e.genre._id === selectedGenre._id ) : allMovies;

      const sorted = _.orderBy(filtered, [ sortColumn.path ], [ sortColumn.order])

      const movies = paginate(sorted, currentPage, pageSize)

      if(count === 0) return <p>There are no movies in the data base</p>;
     
     return (
      <div className="row">

        <div className="col-3" >
        <ListGroup genres={genres}
        onItemSelect={this.handleGenreSelect}
        selectedGenre={this.state.selectedGenre}
        />
        </div>


        <div className="col">
            <p>Showing { filtered.length } movies from the data base</p>
          <MoviesTable 
          movies={ movies } 
          onDelete={ this.handleDelete } 
          onLike={ this.handleLike }
          onSort={this.handleSort}         
          />
          <Pagination 
          itemsCount={filtered.length}
          pageSize={pageSize} 
          handlePageChange={this.handlePageChange} 
          currentPage={currentPage}
          />
        </div>
        </div>
        )
    }
}

export default Movies;

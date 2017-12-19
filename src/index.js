// Create a new component
import _ from 'lodash';
import React, {Component} from "react";
import ReactDom from "react-dom";
import YTSearch from 'youtube-api-search';
const API_KEY = 'AIzaSyD3iCQVP1VCIBiG34T1gLKGOnq8QuNY1T4';


class SearchBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            term : ''
        };
    }

    onInputChange(term){
        this.setState({term});
        this.props.onSearchTermChange(term);
    }
    render(){
        return (
            <div className="search-bar">
                <input onChange={e=>this.onInputChange(e.target.value)}/>
            </div>    
        );
    }

}
class App extends Component{
    constructor(props){
        super(props);
        this.state= { 
            videos: [],
            selectedVideo : null
        };
        this.videoSearch('dog');
    }

    videoSearch(term){
        YTSearch({key: API_KEY, term: term},(videos)=>{
            this.setState({
                videos:videos,
                selectedVideo:videos[0]
            });
        });
    }

    render(){
        const videoSearch = _.debounce(term => {this.videoSearch(term)}, 300);
        return (
            <div>
                <SearchBar onSearchTermChange = {videoSearch}/>
                <VideoDetail video={this.state.selectedVideo}/>
                <VideoList 
                    onVideoSelect = {selectedVideo => this.setState({selectedVideo})}
                    videos={this.state.videos} />
            </div>
            );
    }
}

// video list
const VideoList = (props) => {
    const videoItems = props.videos.map((video)=>{
        return <VideoListItem onVideoSelect={props.onVideoSelect} key={video.etag} video={video}/>
    })
    return (
        <ul className="col-md-4 list-group">
            {videoItems}
        </ul>
    );

};

//video list item
const VideoListItem = ({video, onVideoSelect}) => {
    //const video = props.video;
    const imageUrl = video.snippet.thumbnails.default.url;
    return (
        <li onClick={()=> onVideoSelect(video)} className="list-group-item">
            <div className="video-list media">
                <div className="media-left">
                    <img className="media-object" src={imageUrl}/>
                </div>
                <div className="media-body">
                    <div className="media-heading">{video.snippet.title}</div>
                </div>
            </div>
        </li>
    );
};

//video detail
const VideoDetail = ({video}) => {
    if(!video){
        return <div>Loading...</div>;
    }
    const videoId = video.id.videoId;
    const url = `https://www.youtube.com/embed/${videoId}`;
    return (
        <div className="video-detail col-md-8">
            <div className="embed-responsive embed-responsive-16by9">
                <iframe className="embed-responsive-item" src={url}></iframe>
            </div>
            <div className="details">
                <div>{video.snippet.title}</div>
                <div>{video.snippet.description}</div>
            </div>      
        </div>     
    );
};

ReactDom.render(<App/>,document.querySelector(".container"));
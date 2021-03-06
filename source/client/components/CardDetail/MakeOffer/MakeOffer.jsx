import React, {Component} from 'react'
import ProfileCardList from '../../Profile/ProfileCardList/ProfileCardList.jsx'
import MiniNav from '../../MiniNav/MiniNav.jsx'

import axios from 'axios'
axios.defaults.withCredentials = true;

var config = require('../../../config');

import './MakeOffer.scss'

class MakeOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            username: "",
            user: {},
            usercards: [],
            currentlySelectedCard: "",
            otherAuthor: props.otherAuthor,
            otherCardID: props.otherCardID,
            offer: props.offer,
            tradeMade: false
        }
        this.updateData = this.updateData.bind(this);
    }

    componentWillMount() {
        let endpoint = config.api_endpoint;
        let _this = this;
        // Check login
        axios.get(endpoint + '/auth/profile').then((res) => {
            console.log(res);
            this.setState({isLoggedIn: true, username: res.data.user.username});
        }).catch((err) => {
            console.log(err);
            console.log("Not logged in");
            this.setState({isLoggedIn: false})
        });
    }

    componentDidMount() {
        let endpoint = config.api_endpoint;
        let _this = this;
        // Check login
        axios.get(endpoint + '/auth/profile').then((res) => {
            console.log(res);
            this.setState({isLoggedIn: true, username: res.data.user.username}, this.populate_data.bind(this));
        }).catch((err) => {
            console.log(err);
            console.log("Not logged in");
            this.setState({isLoggedIn: false})
        });

        // var userSchema = mongoose.Schema({
        //     email		: String,
        //     password	: String,
        //     location    : String,
        //     description : String,
        //     tags        : [String],
        //     cards       : [String],
        //     trades      : [String],
        //     profile     : String
        // });
        // Get User data
    }

    populate_data(){
        let endpoint = config.api_endpoint;
        let _this = this;
        let type = this.state.offer === true ? 'false' : 'true';

        axios.get(endpoint + '/api/user/' + "?username=" + this.state.username).then(function(response) {
            _this.setState({user: response.data.data});
        }).catch(function(error) {
            console.log(error);
        });

        axios.get(endpoint + '/api/user-cards/' + '?username=' + this.state.username+'&type='+type+'&status='+ 0).then(function(response) {
            _this.setState({usercards: response.data.data});
        });
    }

    updateData() {
        let endpoint = config.api_endpoint;
        let _this = this;
        // Check login
        axios.get(endpoint + '/auth/profile').then((res) => {
            console.log(res);
            this.setState({isLoggedIn: true, username: res.data.user.username});
        }).catch((err) => {
            console.log(err);
            console.log("Not logged in");
            this.setState({isLoggedIn: false})
        });

        // var userSchema = mongoose.Schema({
        //     email		: String,
        //     password	: String,
        //     location    : String,
        //     description : String,
        //     tags        : [String],
        //     cards       : [String],
        //     trades      : [String],
        //     profile     : String
        // });
        // Get User data

        axios.get(endpoint + '/api/user/' + "?username=" + this.state.username).then(function(response) {
            console.log(response.data.data);
            _this.setState({user: response.data.data});
        }).catch(function(error) {
            console.log(error);
        });

        axios.get(endpoint + '/api/user-cards/' + '?username=' + this.state.username).then(function(response) {
            _this.setState({usercards: response.data.data});
        });
    }

    handleTrade(){
        //Do post
        let endpoint = config.api_endpoint;
        let _this = this;
        console.log("Handle trade");
        let u1sat = false;
        let u2sat = true;

        if (this.state.offer) {
            let u1sat = true;
        }
        axios.post(endpoint + '/api/trades', {
            userOneCard: this.state.currentlySelectedCardId,
            userTwoCard: this.state.otherCardID,
            cardOneOwner: this.state.currentlySelectedCardAuthor,
            cardTwoOwner: this.state.otherAuthor,
            userOneSatisfied: u1sat,
            userTwoSatisfied: u2sat
        }).then(function(response) {
            console.log(response);
            _this.setState({tradeMade: true});
        });
    }

    getId(val){
        this.setState({
            currentlySelectedCardId: val
        });
    }

    getAuthor(val){
        this.setState({
            currentlySelectedCardAuthor: val
        });
    }          

    render() {
        return (
            <div className="wrapper">
            {this.state.tradeMade ? 
                 <h2>Offer is pending approval.</h2> : <div className="MakeOffer">
            <h2>Which card would you like to trade?</h2>
            <h5>Select an open card that you would like completed in exchange for this task. You will be notified if your offer is accepted.</h5>
            <div className="offerlist">
              <ProfileCardList receiveId={this.getId.bind(this)} receiveAuthor={this.getAuthor.bind(this)} cards={this.state.usercards}/>
            </div>
            <h2 className="button" onClick={this.handleTrade.bind(this)}>Trade</h2>
            <p className="exit"><a href="#/">Cancel</a></p>
        </div>}
        </div>
            )
    }
}

export default MakeOffer

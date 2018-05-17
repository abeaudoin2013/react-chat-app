import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col } from 'react-flexbox-grid';
import Message from "./Message";
import Profile from "./Profile";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.attachedImagePreview = "";


    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.attachImage = this.attachImage.bind(this);

  }
  handleKeyUp(e) {
    let a = e.target.value, b = this.props.user, c={};

    if (a !== "") {

      if (!b.isTyping) {
        this.props.updateTyping(b);
      }

      if (e.key === "Enter") {
        c.text = a;
        c.sender = this.props.user;
        c.receiver = this.props.chatee;
        c.date = new Date();
        c.image = this.state.attachedImagePreview;
        e.target.value = "";
        document.getElementById("image-upload-" + c.sender.Id).value = "";
        this.props.updateConversation(c);
        this.props.updateTyping(b);
        this.setState({
          attachedImagePreview: ""
        });
      }

    } else {
      if (b.isTyping) {
        this.props.updateTyping(b);
      }
    }
  }
  attachImage(e) {
    const reader = new FileReader();
    const self = this;

    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
      self.setState({
        attachedImagePreview: reader.result
      });
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };

  }

  render() {

    let messages = _.map(this.props.conversation, (v, i) => {
      return <Message key={"Message-" + i}
                      message={v}
                      user={this.props.user}
                      chatee={this.props.chatee}
                      toggleProfile={this.props.toggleProfile}/>
    });

    let isTyping;
    if (this.props.chatee.isTyping) {
      isTyping = this.props.chatee.userName + " is typing . . .";
    }

    let attachedImagePreview = (
      <div className="AttachImage-preview">
        <img src={this.state.attachedImagePreview} width={"100%"} className={"AttachImage-preview-img"} alt="attached"/>
      </div>
    );

    return (
      <div className="Chat">
        <div className="--container">

          <div className="Intro">
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <div className={"-Greeting"}>Hey, <b onClick={(e) => {this.props.toggleProfile(e, this.props.user)}}>{this.props.user.firstName}</b></div>
              </Col>
            </Row>
            <Row>
              <Col xs={3} sm={3} md={3} lg={3}>
                <div 
                  style={
                    {background: 'url(' + this.props.chatee.avatar + ') no-repeat', 
                    backgroundSize: 'cover', backgroundPosition: 'center'}
                  } 
                  className={"-Avatar"} 
                  width={"100%"} 
                  onClick={(e) => {
                    this.props.toggleProfile(e, this.props.chatee)}
                  } 
                  alt={this.props.chatee.userName}/>
              </Col>
              <Col xs={9} sm={9} md={9} lg={9}>
                <p>You are chatting with . . .</p>
                <div className={"About"}>
                  <div 
                    className={"-UserName"} 
                    onClick={(e) => {
                      this.props.toggleProfile(e, this.props.chatee)}
                    }>{this.props.chatee.userName}</div>
                  <div className={"-FullName"}><span className={"-First name"}>{this.props.chatee.firstName}</span> <span className={"-Last name"}>{this.props.chatee.lastName}</span></div>
                </div>

                {this.props.showProfile.show ? <Profile user={this.props.showProfile.profile} coordinates={this.props.coordinates}/> : ""}
              </Col>
            </Row>
          </div>

          {messages}

          <input type="text" className={"Input"} placeholder={"Message " + this.props.chatee.userName} onKeyUp={(e)=>{this.handleKeyUp(e)}}/>
          <div className="AttachImage">
            <input type="file" id={"image-upload-" + this.props.user.Id} className={"AttachImage-Input"} onChange={this.attachImage}/>
            {this.state.attachedImagePreview !== "" ? attachedImagePreview : ""}
          </div>

          <p>{isTyping}</p>
        </div>
      </div>
    );
  }
}

export default Chat;

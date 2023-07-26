import React, { Component } from "react";
import "./App.css";
import Input from "./Input";
import Messages from "./Messages";

function randomName() {
  const names = [
    "Karlo",
    "Sara",
    "Luka",
    "Ana",
    "Robert",
    "Jan",
    "Ivan",
    "Vili",
    "Tia",
    "Noa",
  ];
  const lastnames = [
    "Sharp",
    "Kranjčec",
    "Šverko",
    "Omeragić",
    "Koroušić",
    "Podhraški",
    "Bartolić",
    "Majsec",
    "Jaković",
    "Kudrić",
  ];
  const name = names[Math.floor(Math.random() * names.length)];
  const lastname = lastnames[Math.floor(Math.random() * lastnames.length)];
  return name + lastname;
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor(),
    },
  };

  constructor() {
    super();
    this.drone = new window.Scaledrone("fcP8qOEDeYaXG9Xn", {
      data: this.state.member,
    });
    this.drone.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      const member = { ...this.state.member };
      member.id = this.drone.clientId;
      this.setState({ member });
    });
    const room = this.drone.subscribe("observable-room");
    room.on("data", (data, member) => {
      const messages = [...this.state.messages];
      messages.push({ member, text: data });
      this.setState({ messages });
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Web Chat App</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input onSendMessage={this.onSendMessage} />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message,
    });
  };
}

export default App;

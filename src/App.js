import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
} from "react-live";
import shadesOfPurple from "prism-react-renderer/themes/shadesOfPurple";
import React from "react";

const client = new WebSocket("ws://localhost:1122");



export default class App extends React.Component {

  state = {
    err: "",
    correct: "",
    code: `//const names = ["name1", "name2", "name3", "name4"]
<div>
    <h1>Some awesome names:</h1>
    {/*your code here*/}
</div>
    `,
    resultElement: React.createRef(),
    scope: {
      names: ["ron", "bob", "jon", "tom"]
    }
  }

  handleButtonClick = () => {
    const liArr = Array.from(this.state.resultElement.current.querySelectorAll('li'));
    console.log(liArr)
    if(liArr.length === 0) {
      console.log("WRONG")
      this.setState({err: 'unable to find list with Li elements'})
    } else {
      const nameArr = liArr.map((li) => li.innerText)
      console.log(nameArr, this.state.scope.names)
      if(JSON.stringify(nameArr) === JSON.stringify(this.state.scope.names)) {
        console.log("CORRECT")
        this.setState({
          err: "",
          correct: "Great Job"
        })
        client.send("CORRECT")
      } else {
        console.log("WRONG")
        this.setState({
          err: "List doesn't contain the correct names"
        })
      }
    }
  };

  render() {
    return (
      <div className="container">
        <iframe title="game" src="/export" />
       <section>
         Given an array of names create a dynamic unordered list of Li tags containing the names
       </section>
       <LiveProvider
         code={this.state.code}
         scope={this.state.scope}
       >
         <LiveEditor theme={shadesOfPurple} />
         <LiveError style={{ color: "red" }} />
         <div ref={this.state.resultElement}>
          <LivePreview />
         </div>
       </LiveProvider>
       <section>
         {this.state.err && <div style={{color: "red"}}>{this.state.err}</div>}
         {this.state.correct && <div style={{color: "green"}}>{this.state.correct}</div>}
       </section>
       <button onClick={this.handleButtonClick}>Submit</button>
     </div>
    )
  }
}
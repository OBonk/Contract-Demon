const { spawn } = require('child_process');
const exec = require('await-exec')
const inquirer = require('inquirer')
const fs = require('fs');
const path = require("path")
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});
const keypress = async () => {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise(resolve => process.stdin.once('data', () => {
    process.stdin.setRawMode(false);
    resolve();
  }))
}

function prepFuzz(location,targetFunction,contractName){
  script = ""
  target = ""
  try {  
    let data = fs.readFileSync('./scripts/intfuzz.txt', 'utf8');
    let data2 = fs.readFileSync(location,"utf8")
    target = data2.toString();
    script = data.toString().replace("※",contractName);
    if (targetFunction!=""){
      script= script.replace("*","false");
      script = script.replace("†",targetFunction);
    } else {
      script = script.replace("*","true");
      script = script.replace("†","test");
    }
  } catch(e) {
      console.log('Error:', e.stack);
  }
  fs.writeFile('./contracts/inttest.sol', target, function (err) {
    if (err) return false;
  });
  fs.writeFile('./scripts/intfuzz.js',script, function (err) {
    if (err) return false;
  });
  return true;
}

async function demonstrate(exploit){
  switch(exploit){
    case "Reentrancy":
      command = "npx hardhat run --network localhost scripts/Reentrancy.js";
      break;
    case "Integer Under/Overflow":
      command = "npx hardhat run --network localhost scripts/Underflow.js";
      break;
    case "delegatecall":
      command = "npx hardhat run --network localhost scripts/delegatecall.js";
      break;
    case "selfdestruct":
      command = "npx hardhat run --network localhost scripts/selfdestruct.js";
      break;
    case "tx.origin":
      command = "npx hardhat run --network localhost scripts/txorigin.js";
      break;
    case "default access":
      command = "npx hardhat run --network localhost scripts/accessidentifier.js";
      break;
  }
  const { stdout,stderr } = await exec(command);
  console.log(stdout,stderr)
  console.log("\n Press enter to continue....")
  await keypress()
  main(true);
}
async function wait(){
  console.log("\n Press enter to continue....")
  await keypress()
  main(true);
}
async function fuzz(){
  command = "npx hardhat run --network localhost scripts/intfuzz.js";
  const { stdout,stderr } = await exec(command);
  console.log(stdout,stderr);
  fs.unlink('./contracts/inttest.sol', (err) => {
    if (err) throw err;
  });
  fs.unlink('./scripts/intfuzz.js', (err) => {
    if (err) throw err;
  });
  console.log("\n Press enter to continue....")
  await keypress()
  main(true);
}

function prepareTest(location,depFunc,withFunc,contractName){
  const specChars = ["†","‡","※"]
  let attacker = ""
  let victim = ""
  let script = ""
  try {
    let data3 = fs.readFileSync("./scripts/rechecker.txt", "utf8")
    script = data3.toString().replace("※",depFunc);
    script = script.replace("†",contractName);
    let data2 = fs.readFileSync(location, 'utf8');
    victim = data2.toString() +"\n";  
    let data = fs.readFileSync("./contracts/recheckercon.txt", 'utf8');
    let temp = data.toString();
    
    while (temp.includes("†")) {
      temp = temp.replace("†",contractName);
    }
    while (temp.includes("‡")) {
      temp = temp.replace("‡",withFunc);
    }
    while (temp.includes("※")) {
      temp = temp.replace("※",depFunc);
    }
    attacker = temp;
  } catch(e) {
      console.log('Error:', e.stack);
  }
  res = victim + attacker;
  fs.writeFile('./scripts/rechecker.js',script, function (err) {
    if (err) return false;
  });
  fs.writeFile('./contracts/test.sol', (victim + attacker), function (err) {
    if (err) return false;
    return true;
  });
  return true;
  
}

async function reTest(){
  command = "npx hardhat run --network localhost scripts/rechecker.js";
  const { stdout,stderr } = await exec(command);
  console.log(stdout,stderr);
  fs.unlink('./contracts/test.sol', (err) => {
    if (err) throw err;
  });
  fs.unlink('./scripts/rechecker.js', (err) => {
    if (err) throw err;
  });
  console.log("\n Press enter to continue....")
  await keypress()
  main(true);
}

function document(exploit){
  try {  
    let data = fs.readFileSync(exploit+'.txt', 'utf8');
    console.log(data.toString());    
  } catch(e) {
      console.log('Error:', e.stack);
  }
}
function spawnNetwork(){
    const bat = spawn('start cmd.exe /K start.bat', { shell: true });
    console.log("Network running!")
}
async function main(run){
  const options = [
    'Start Network',
    'View Exploits',
    'Quit',
  ]
  const postnet = [
    {name:'Start Network',disabled:'Network started!'},
    'View Exploits',
    'Quit',
  ]
  const checks = ["Reentrancy","Integer Under/Overflow","delegatecall"]
  running = run;
  let questions = [
    {
      type: 'list',
      name: 'opt',
      message: 'Choose an option:',
      choices: options,
      when:(!running)
    },
    {
      type: 'list',
      name: 'opt',
      message: 'Choose an option:',
      choices: postnet,
      when:running
    },
    {
      type: 'list',
      name: 'exploits',
      message: 'What exploit do you want to look at?',
      choices: ["Reentrancy","Integer Under/Overflow","selfdestruct","tx.origin","delegatecall","default access"],
      when (answers) {
        return answers.opt == "View Exploits";
        },
    },
    {
      type: 'list',
      name: 'ops',
      message: 'What do you want to do?',
      choices: ["View Documentation","Demonstrate","Check for"],
      when(answers){
        return (checks.includes(answers.exploits)) && ("exploits" in answers)
      }
    },
    {
      type: 'list',
      name: 'ops',
      message: 'What do you want to do?',
      choices: ["View Documentation","Demonstrate"],
      when(answers){
        return !(checks.includes(answers.exploits)) && ("exploits" in answers)
      }
    },
    {
      type: "input",
      name: "dep",
      message: "Enter deposit function of contract",
      when(answers){
        return (answers.ops == "Check for" && answers.exploits == "Reentrancy")
      }
    },
    {
      type: "input",
      name: "tar",
      message: "Enter target function of contract (leave empty to transfer Ether instead)",
      when(answers){
        return (answers.ops == "Check for" && answers.exploits == "Integer Under/Overflow")
      }
    },
    {
      type: "input",
      name: "withd",
      message: "Enter withdraw function of contract",
      when(answers){
        return (answers.ops == "Check for" && answers.exploits == "Reentrancy")
      }
    },
    {
      type: "input",
      name: "conName",
      message: "Enter name of contract",
      when(answers){
        return (answers.ops == "Check for" && ["Reentrancy","Integer Under/Overflow"].includes(answers.exploits))
      }
    },
    {
      type: "input",
      name: "aPath",
      message: "Enter absolute path of contract",
      when(answers){
        return (answers.ops == "Check for" )
      }
    },
  ]
  // while (running) {
  console.clear();
  try {  
    let data = fs.readFileSync('title.txt', 'utf8');
    console.log("\x1b[31m",data.toString());    
  } catch(e) {
      console.log('Error:', e.stack);
  }
  
  inquirer
  .prompt(
    questions
  )
  .then((answer) => {
    // console.log(answer)
    switch(answer.opt){
      case "Start Network":
        spawnNetwork();
        main(true);
        break;
      case "View Exploits":
        switch(answer.ops){
          case("Demonstrate"):
            if (running){
              demonstrate(answer.exploits)
            } else {
              console.log("Start network!")
            }
            break;
          case("Documentation"):
            break;
          case("Check for"):
            if (running){
              switch(answer.exploits){
                case("Reentrancy"):
                  let aPath = answer.aPath;
                  let conName = answer.conName;
                  let dep = answer.dep;
                  let withd = answer.withd;
                  let relativePath = path.relative(process.cwd(), aPath);
                  if (prepareTest(relativePath, dep, withd, conName)) {
                    reTest();
                  } else {
                    wait();
                  }
                  break;
                case("Integer Under/Overflow"):
                  let aPath2 = answer.aPath;
                  let conName2 = answer.conName;
                  let tar = answer.tar;
                  let relativePath2 = path.relative(process.cwd(), aPath2);
                  if (prepFuzz(relativePath2,tar,conName2)) {
                    fuzz();
                  } else {
                    wait();
                  }
                  break;
                case("delegatecall"):
                  break;
              }
            }
            break;
        }
        break;
      case "Quit":
        break;
    }
  });
  
}
main(false);
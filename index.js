import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();
const path = "./data.json";

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let counter = 0;

async function makeCommits(n, batchSize = 1000) {
  for (let i = 0; i < n; i++) {
    counter++;

    const x = random.int(0, 54);
    const y = random.int(0, 6);
    const date = moment()
      .subtract(getRndInteger(1, 3), "y")
      .add(1, "d")
      .add(x, "w")
      .add(y, "d")
      .format();

    const data = { date };
    await jsonfile.writeFile(path, data);

    await git.add([path]);
    await git.commit(`Commit #${counter}`, [path], { "--date": date });

    // Push only every batch
    if (counter % batchSize === 0) {
      console.log(`Pushing after ${counter} commits...`);
      await git.push("origin", "main", ["--force"]);
    }
  }

  // Final push at the end
  console.log("Final push...");
  await git.push("origin", "main", ["--force"]);
  console.log("All commits done!");
}

makeCommits(250000);
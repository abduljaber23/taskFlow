// import AbstractSeeder from "./AbstractSeeder";
// import UserSeeder from "./UserSeeder";

// class ProjectsSeeder extends AbstractSeeder {
//   constructor() {
//     super({ table: "projects", truncate: false, dependencies: [UserSeeder] });
//   }

//   run() {
//     for (let i = 0; i < 100; i += 1) {
//       const randomTagIndex = Math.floor(Math.random() * 10);
//       const userRef = this.getRef(`user${randomTagIndex}`);
//       if (!userRef) {
//         console.warn(
//           `User reference "user${randomTagIndex}" not found, skipping project ${i}`,
//         );
//         continue;
//       }
//       const fakeProject = {
//         uuid: this.faker.string.uuid(),
//         refName: `project${i}`,
//         name: this.faker.internet.email(),
//         description: this.faker.lorem.sentence(),
//         status: this.faker.helpers.arrayElement(["public", "private"]),
//         createdBy: userRef.uuid,
//       };

//       this.insert(fakeProject);
//     }
//   }
// }

// export default ProjectsSeeder;

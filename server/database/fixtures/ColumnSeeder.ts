// import AbstractSeeder from "./AbstractSeeder";
// import ProjectsSeeder from "./ProjectsSeeder";
// import UserSeeder from "./UserSeeder";

// class ColumnSeeder extends AbstractSeeder {
//   constructor() {
//     super({
//       table: "projectcolumns",
//       truncate: false,
//       dependencies: [ProjectsSeeder],
//     });
//   }

//   run() {
//     for (let i = 0; i < 100; i += 1) {
//       const randomTagIndex = Math.floor(Math.random() * 10);
//       const projectRef = this.getRef(`project${randomTagIndex}`);
//       if (!projectRef) {
//         console.warn(
//           `project reference "project${randomTagIndex}" not found, skipping project ${i}`,
//         );
//         continue;
//       }
//       const fakeColumn = {
//         refName: `column${i}`,
//         uuid: this.faker.string.uuid(),
//         name: this.faker.internet.email(),
//         position: this.faker.number.int({ min: 0, max: 100 }),
//         projectId: projectRef.uuid,
//       };

//       this.insert(fakeColumn);
//     }
//   }
// }

// export default ColumnSeeder;

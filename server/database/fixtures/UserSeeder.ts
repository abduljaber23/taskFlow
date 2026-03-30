import AbstractSeeder from "./AbstractSeeder";

class UserSeeder extends AbstractSeeder {
  constructor() {
    super({ table: "users", truncate: false });
  }

  run() {
    for (let i = 0; i < 10; i += 1) {
      const fakeUser = {
        uuid: this.faker.string.uuid(),
        refName: `user${i}`,
        email: this.faker.internet.email(),
        username: this.faker.internet.username(),
        password: this.faker.internet.password(),
      };

      this.insert(fakeUser);
    }
  }
}

export default UserSeeder;

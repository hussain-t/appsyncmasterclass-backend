const given = require("../../steps/given");
const when = require("../../steps/when");

describe("Given an authenticated user", () => {
  let user;
  beforeAll(async () => {
    user = await given.an_authenticated_user();
  });

  it("The user can fetch his profile with getMyProfile", async () => {
    console.log("user...", user)
    const profile = await when.a_user_calls_getMyProfile(user);

    console.log("profile...", profile)
    expect(profile).toMatchObject({
      id: user.username,
      name: user.name,
      imageUrl: null,
      backgroundImageUrl: null,
      bio: null,
      location: null,
      website: null,
      birthdate: null,
      createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g),
      // tweets
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCount: 0
    });

    const [firsName, lastName] = user.name.split(" ");
    expect(profile.screenName).toContain(firsName);
    expect(profile.screenName).toContain(lastName);
  })
})
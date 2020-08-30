let users = [
  {
    id: '4f4b3e27-aa69-4500-a297-b80183195118',
    name: 'Ammar',
    email: 'Ammar@kurabi.net',
    age: 15,
  },
  {
    id: '4352beb2-38c9-4103-b084-a0519e595067',
    name: 'Sarah',
    email: 'sarah@kurabi.net',
  },
  {
    id: 'bc368dd1-2242-4835-b275-f071966b4f9e',
    name: 'Michael',
    email: 'michael@kurabi.net',
    age: 29,
  },
];

let posts = [
  {
    id: '96025c65-dd3d-425c-a962-a02738c896ba',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '4f4b3e27-aa69-4500-a297-b80183195118',
  },
  {
    id: 'a2a3f8b3-c399-4531-be09-ea722c11e5f8',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: true,
    author: '4f4b3e27-aa69-4500-a297-b80183195118',
  },
  {
    id: 'ad0f8c17-1473-470c-b17f-c7d44ab25cdb',
    title: 'Programming Music',
    body:
      'David Cutter Music is my favorite artist to listen to while programming.',
    published: false,
    author: '4352beb2-38c9-4103-b084-a0519e595067',
  },
];

let comments = [
  {
    id: '123',
    title: 'first comment',
    body: 'first comment body',
    date: 1234,
    author: 'bc368dd1-2242-4835-b275-f071966b4f9e',
    post: '96025c65-dd3d-425c-a962-a02738c896ba',
  },
  {
    id: '456',
    title: 'second comment',
    body: 'second comment body',
    date: 5678,
    author: '4352beb2-38c9-4103-b084-a0519e595067',
    post: '96025c65-dd3d-425c-a962-a02738c896ba',
  },
  {
    id: '975',
    title: 'third comment',
    body: 'third comment body',
    date: 5678,
    author: '4352beb2-38c9-4103-b084-a0519e595067',
    post: 'a2a3f8b3-c399-4531-be09-ea722c11e5f8',
  },
];

const db = { users, posts, comments };
export { db as default };

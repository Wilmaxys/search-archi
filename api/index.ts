import fastify from 'fastify';

const server = fastify({ logger: true });

//@Routes
server.get('/', (req, res) => {
  res.status(200).send({ success: true, message: 'Query successful' });
});

//@Server
server.listen(5000, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log(`Server running, navigate to  https://localhost:5000`);
  }
});

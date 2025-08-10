import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const servidor = express();
const porta = process.env.PORT || 3000;

servidor.set('view engine', 'ejs');
servidor.use(express.static(path.join(__dirname, 'public')));
servidor.use(express.urlencoded({ extended: true }));

let id = 0
class postObject {
  constructor(data, titulo, texto, id) {
    this.id = id
    this.dataFormatada = data.toLocaleDateString("pt-br")
    this.horarioFormatado = data.getHours() + ":" + data.getMinutes();
    this.titulo = titulo;
    this.texto = texto
  }
}

const posts = [];

servidor.get('/', (req, res) => {
    res.render('index', {posts: posts});
});

servidor.post('/submit', (req, res) => {
    res.render('submit')
});

servidor.post('/submit/confirm', (req, res) => {
  const data = new Date();
  const titulo = req.body.titulo;
  const texto = req.body.texto;
  posts.push(new postObject(data, titulo, texto, id));
  id++;
  res.redirect('/');
})

servidor.get('/editar', (req, res) => {
  let postId = req.query.id;
  let postClicado = posts.find(posts => posts.id == postId);
  res.render('editar', { postClicado: postClicado });
});

servidor.post("/editar/confirm", (req, res) => {
  let postId = req.query.postClicado;
  let postEditar = posts.find(posts => posts.id == postId);
  postEditar.titulo = req.body.titulo;
  postEditar.texto = req.body.texto;
  res.redirect('/');
})
servidor.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});

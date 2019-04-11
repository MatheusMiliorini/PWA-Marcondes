<?php

header("Content-Type: application/json;charset=utf-8");

set_error_handler("warning_handler",E_WARNING);

function warning_handler($errno, $errmsg) {
    echo json_encode([
        "erro" => htmlspecialchars_decode($errmsg)
    ]);
    die;
}

$op = filter_input(INPUT_POST, 'op');
$idCategoria = filter_input(INPUT_POST, 'idCategoria');
$nomeCategoria = filter_input(INPUT_POST, 'nomeCategoria');

$produto = filter_input(INPUT_POST, 'produto');
$nome = filter_input(INPUT_POST, 'nome');
$descricao = filter_input(INPUT_POST, 'descricao');
$valor = filter_input(INPUT_POST, 'valor');
$categoria = filter_input(INPUT_POST, 'categoria');

try {
    $API = new API();
    switch ($op) {
        case 'TC':
            $dados = $API->buscaTodasCategorias();
            break;
        case 'TP':
            $dados = $API->buscaTodosProdutos();
            break;
        case 'DC':
            $dados = $API->deletaCategoria($categoria);
            break;
        case 'DP':
            $dados = $API->deletaProduto($produto);
            break;
        case 'AC':
            $dados = $API->adicionaCategoria($nomeCategoria);
            break;
        case 'AP':
            $dados = $API->adicionaProduto($nome, $valor, $categoria, $descricao);
            break;
        case 'EP':
            $dados = $API->editaProduto($nome, $valor, $categoria, $descricao, $produto);
            break;
        case 'EC':
            $dados = $API->editaCategoria($categoria, $nome);
            break;
        default:
            $dados = "Nenhuma opção de consulta fornecida";
            break;
    }
    echo json_encode($dados);

} catch (Exception $ex) {
    json_encode($ex->getMessage());
}

class API
{
    private $host = "localhost";
    private $port = 5432;
    private $user = "postgres";
    private $pass = "postgres";
    private $dbname = "marcondes";
    private $con;

    public function __construct()
    {
        $this->con = pg_connect("host=$this->host port=$this->port dbname=$this->dbname
        user=$this->user password=$this->pass");
    }

    public function buscaTodosProdutos()
    {
        $sql = "SELECT p.*, c.nome as nome_categoria FROM produtos p LEFT JOIN categorias c ON p.categoria_id = c.categoria_id ORDER BY p.produto_id";
        return pg_fetch_all(pg_query($this->con, $sql));
    }

    public function buscaTodasCategorias()
    {
        $sql = "SELECT * FROM  categorias";
        return pg_fetch_all(pg_query($this->con, $sql));
    }

    public function deletaCategoria($categoria) {
      $sql = "DELETE FROM categorias WHERE categoria_id = $1";
      return pg_affected_rows(pg_query_params($this->con, $sql, [$categoria]));
    }

    public function adicionaCategoria($nomeCategoria) {
        $sql = "INSERT INTO categorias(nome) VALUES ($1)";
        return pg_result_status(pg_query_params($this->con, $sql, [$nomeCategoria]));
    }

    public function adicionaProduto($nome, $valor, $categoria, $descricao) {
        $sql = "SELECT categoria_id FROM categorias WHERE nome ILIKE $1";
        $res = pg_fetch_object(pg_query_params($this->con, $sql, [$categoria]));
        $cat_id = isset($res->categoria_id) ? $res->categoria_id : null;

        $sql = "INSERT INTO produtos(nome,valor,descricao,categoria_id) VALUES($1,$2,$3,$4)";
        return pg_result_status(pg_query_params($this->con, $sql, [
            $nome,$valor,$descricao,$cat_id
        ]));
    }

    public function deletaProduto($produto) {
        $sql = "DELETE FROM produtos WHERE produto_id = $1";
        return pg_result_status(pg_query_params($this->con, $sql, [$produto]));
    }

    public function editaProduto($nome, $valor, $categoria, $descricao, $produto) {

        $sql = "SELECT categoria_id FROM categorias WHERE nome ILIKE $1";
        $res = pg_fetch_object(pg_query_params($this->con, $sql, [$categoria]));
        $res = isset($res->categoria_id) ? $res->categoria_id : null;
        $sql = "UPDATE produtos SET nome=$1, valor=$2, categoria_id=$3, descricao=$4 WHERE produto_id=$5";

        return pg_result_status(pg_query_params($this->con, $sql, [
            $nome, $valor, $res, $descricao, $produto
        ]));
    }

    public function editaCategoria($categoria, $nome) {
      $sql = "UPDATE categorias SET nome = $1 WHERE categoria_id = $2";
      return pg_result_status(pg_query_params($this->con, $sql, [$nome, $categoria]));
    }
}

$(document).ready(function() {
  // Busca os produtos e preenche a tela
  $.ajax({
    url: "API.php",
    method: "POST",
    data: {
      op: "TP"
    },
    success: function(data) {
      if (!data) return false;
      data.forEach(produto => {
        html  = `<div class="col-12 col-md-3"><h4>${produto.nome}</h4>`;
        html += `<h6>${produto.descricao}</h6>`;
        html += `<h6>R$ ${produto.valor}</h6>`;
        html += `<h6>Categoria: ${produto.nome_categoria}</h6>`;
        if (localStorage.getItem("ID_Google") !== null) {
          html += `
          <button class="btn btn-info editar"
          data-produto-id="${produto.produto_id}"
          data-produto-nome="${produto.nome}"
          data-produto-descricao="${produto.descricao}"
          data-produto-valor="${produto.valor}"
          data-produto-categoria="${produto.nome_categoria}"
          >Editar</button>
          `;
          html += `<button class="btn btn-danger excluir" data-produto-id="${produto.produto_id}">Excluir</button>`;
        }

        html += `</div>`;
        $(".listaProdutos").prepend(html);
      });
    },
    error() {
      console.log("Impossível buscar dados!");
    }
  });

  // Busca todas as categorias e preenche a tabela
  $.ajax({
    url: "API.php",
    method: "POST",
    data: {
      "op": "TC",
    },
    success: function(data) {
      let $tabelaCategorias = $("#tabelaCategorias");
      if (!data) return false;
      data.forEach(cat => {
        let html = `<tr><td>${cat.nome}</td>`;
        if (localStorage.getItem("ID_Google") !== null) {
          html    += `<td class="opcaoTabela editar" data-nome="${cat.nome}" data-id="${cat.categoria_id}">Editar</td>`;
          html    += `<td class="opcaoTabela excluir" data-nome="${cat.nome}" data-id="${cat.categoria_id}">Excluir</td></tr>`;
        }
        $tabelaCategorias.append(html);
      });
    },
    error() {
      console.log("Impossível buscar dados!");
    }
  });

  $("table").on('click','.editar', function() {
    swal({
      title: "Editar categoria",
      text: "Insira o novo nome da categoria",
      content: "input"
    }).then(val => {
      if (!val) return false;

      $.ajax({
        url: "API.php",
        method: "POST",
        data: {
          "op": "EC",
          "categoria": $(this).attr("data-id"),
          "nome": val,
        },
        success: function() {
          location.reload();
        }
      });
    });

    $(".swal-content__input").val($(this).attr("data-nome"));
  });

  $("table").on('click','.excluir', function() {
    swal({
      title: "Deletar produto",
      text: "Tem certeza que deseja deletar esta categoria e todos os seus produtos?",
      dangerMode: true
    }).then(val => {
      if (!val) return false;

      $.ajax({
        url: "API.php",
        method: "POST",
        data: {
          op: "DC",
          categoria: $(this).attr("data-id"),
        },
        success: function(data) {
          location.reload();
        }
      })
    })
  });

  $("#novaCategoria").click(function() {
    swal({
      title: "Nova categoria",
      text: "Insira o nome da nova categoria.",
      content: "input"
    }).then(val => {
      if (!val) return false;

      $.ajax({
        url: "API.php",
        method: "POST",
        data: {
          op: "AC",
          nomeCategoria: val
        },
        success: function() {
          location.reload();
        }
      });
    });
  });

  $(".listaProdutos").on('click', '.excluir', function () {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      $.ajax({
        url: "API.php",
        method: "POST",
        data: {
          op: "DP",
          produto: $(this).attr('data-produto-id'),
        },
        success: function(data) {
          location.reload();
        }
      });
    }
  });

  $(".listaProdutos").on('click', '.editar', function () {
    let div = document.createElement("div");
    let html = `
    <label>Nome:</label><input id="editNome" type="text" class="form-control" value="${$(this).attr("data-produto-nome")}">
    <label>Descrição:</label><input id="editDesc" type="text" class="form-control" value="${$(this).attr("data-produto-descricao")}">
    <label>Valor:</label><input id="editVal" type="number" step=".01" class="form-control" value="${$(this).attr("data-produto-valor")}">
    <label>Categoria:</label><input id="editCat" type="text" step=".01" class="form-control" value="${$(this).attr("data-produto-categoria")}">
    <input type="hidden" id="editProdutoID" value="${$(this).attr("data-produto-id")}">
    `;
    div.setAttribute("style","text-align: left");
    $(div).append(html);
    swal({
      title: "Editar produto",
      content: div,
    }).then(ok => {
      if (!ok) return false;
      let nome = $("#editNome").val(),
      desc = $("#editDesc").val(),
      valor = $("#editVal").val(),
      categoria = $("#editCat").val(),
      produto_id = $("#editProdutoID").val();
      $.ajax({
        url: "API.php",
        method: "POST",
        data: {
          op: "EP",
          nome: nome,
          descricao: desc,
          valor: valor,
          categoria: categoria,
          produto: produto_id,
        },
        success: function(data) {
          if (data === 1) {
            location.reload();
          } else {
            swal({
              title: "Erro!",
              icon: "error",
              text: "Verifique se a categoria indicada existe!",
            });
          }
        }
      });

    });
  });

  $("#adicionarProduto").click(function () {
    let div = document.createElement("div");
    let html = `
    <label>Nome:</label><input id="addNome" type="text" class="form-control">
    <label>Descrição:</label><input id="addDesc" type="text" class="form-control">
    <label>Valor:</label><input id="addVal" type="number" step=".01" class="form-control">
    <label>Categoria:</label><input id="addCat" type="text" step=".01" class="form-control">
    `;
    div.setAttribute("style","text-align: left");
    $(div).append(html);
    swal({
      title: "Adicionar produto",
      content: div,
    }).then(ok => {
      if (!ok) return false;
      let nome = $("#addNome").val(),
      desc = $("#addDesc").val(),
      valor = $("#addVal").val(),
      categoria = $("#addCat").val();
      $.ajax({
        url: "API.php",
        method: "POST",
        data: {
          op: "AP",
          nome: nome,
          descricao: desc,
          valor: valor,
          categoria: categoria,
        },
        success: function(data) {
          if (data === 1) {
            location.reload();
          } else {
            swal({
              title: "Erro!",
              icon: "error",
              text: "Verifique se a categoria indicada existe!",
            });
          }
        }
      });
    });
  });
});

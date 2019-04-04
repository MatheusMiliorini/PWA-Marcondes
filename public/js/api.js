$(document).ready(function() {
    // Busca os produtos e preenche a tela
    $.ajax({
        url: "http://localhost/aula_21_03/API.php",
        method: "POST",
        data: {
            op: "TP"
        },
        success: function(data) {
            data.forEach(produto => {
                html  = `<div class="col-3"><h4>${produto.nome}</h4>`;
                html += `<h6>${produto.descricao}</h6>`;
                html += `<h6>R$ ${produto.valor}</h6>`;
                html += `<h6>Categoria: ${produto.nome_categoria}</h6>`;
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
                html += `</div>`;
                $(".listaProdutos").append(html);
            });
        }
    });

    $(".listaProdutos").on('click', '.excluir', function () {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            $.ajax({
                url: "http://localhost/aula_21_03/API.php",
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
                url: "http://localhost/aula_21_03/API.php",
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


});
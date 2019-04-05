$(document).ready(function() {
    // Busca os produtos e preenche a tela
    $.ajax({
        url: "API.php",
        method: "POST",
        data: {
            op: "TP"
        },
        success: function(data) {
            data.forEach(produto => {
                html  = `<div class="col-12 col-md-3"><h4>${produto.nome}</h4>`;
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
            html = `<div class="col-12 col-md-3" style="display:flex; align-items: center; min-height: 150px"><button class="btn btn-warning adicionar">Adicionar</button></div>`;
            $(".listaProdutos").append(html);
        }
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

    $(".listaProdutos").on('click', '.adicionar', function () {
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
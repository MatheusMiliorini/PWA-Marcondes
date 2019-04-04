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
                html += `<button class="btn btn-info editar" data-produto-id="${produto.produto_id}">Editar</button>`;
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


});
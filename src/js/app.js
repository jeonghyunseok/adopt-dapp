App = {
  web3Provider: null,
  contracts: {},
	
  init: function() {
    $.getJSON('../pet.json', function(data) {
      var list = $('#list');
      var template = $('#template');

      for (i = 0; i < data.length; i++) {
        template.find('img').attr('src', data[i].picture);
        template.find('.id').text(data[i].id);
        template.find('.type').text(data[i].type);
        template.find('.name').text(data[i].name);
        template.find('.price').text(data[i].price);

        list.append(template.html());
      }
    })

    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
	  $.getJSON('AdoptPet.json', function(data) {
      App.contracts.AdoptPet = TruffleContract(data);
      App.contracts.AdoptPet.setProvider(App.web3Provider);
      App.listenToEvents();
    });
  },

  buyAdoptPet: function() {	
    var id = $('#id').val();
    var name = $('#name').val();
    var price = $('#price').val();
    var email = $('#email').val();

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      App.contracts.AdoptPet.deployed().then(function(instance) {
        var nameUtf8Encoded = utf8.encode(name);
        var emailUtf8Encoded = utf8.encode(email);
        return instance.buyAdoptPet(id, web3.toHex(nameUtf8Encoded),  web3.toHex(emailUtf8Encoded), { from: account, value: price });
      }).then(function() {
        $('#name').val('');
        $('#email').val('');
        $('#buyModal').modal('hide');  
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  loadAdoptPets: function() {
    App.contracts.AdoptPet.deployed().then(function(instance) {
      return instance.getAllBuyers.call();
    }).then(function(buyers) {
      for (i = 0; i < buyers.length; i++) {
        if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
          var imgType = $('.panel-adoptpet').eq(i).find('img').attr('src').substr(7);
          $('.panel-adoptpet').eq(i).find('img').attr('src', 'images/animal/success.png')
          $('.panel-adoptpet').eq(i).find('.btn-buy').text('분양').attr('disabled', true);
          $('.panel-adoptpet').eq(i).find('.btn-buyerInfo').removeAttr('style');
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    })
  },
	
  listenToEvents: function() {
	  App.contracts.AdoptPet.deployed().then(function(instance) {
      instance.LogBuyAdoptPet({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(error, event) {
        if (!error) {
          $('#events').append('<li class="list-group-item"> <span class="glyphicon glyphicon-pencil" style="margin-right:1em"></span>' + event.args._buyer + ' 계정에서 ' + event.args._id + ' 번 동물을 분양했습니다.' + '</li>');
        } else {
          console.error(error);
        }
        App.loadAdoptPets();
      })
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  $('#buyModal').on('show.bs.modal', function(e) {
    var id = $(e.relatedTarget).parent().find('.id').text();
    var price = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.price').text() || 0), "ether");

    $(e.currentTarget).find('#id').val(id);
    $(e.currentTarget).find('#price').val(price);
  });

  $('#buyerInfoModal').on('show.bs.modal', function(e) {
    var id = $(e.relatedTarget).parent().find('.id').text();
   
    App.contracts.AdoptPet.deployed().then(function(instance) {
      return instance.getBuyerInfo.call(id);
    }).then(function(buyerInfo) {
      $(e.currentTarget).find('#buyerAddress').text(buyerInfo[0]);
      $(e.currentTarget).find('#buyerName').text(web3.toUtf8(buyerInfo[1]));
      $(e.currentTarget).find('#buyerEmail').text(web3.toUtf8(buyerInfo[2]));
    }).catch(function(err) {
      console.log(err.message);
    })
  });
});

window.onload = function() { 'use strict';
  function pushNodeForAlign(nodes, on, tn) {
    var oh, th, diff, node;

    oh = on.offsetHeight;
    th = tn.offsetHeight;

    if (oh != th) {
      if (oh < th) {
        diff = th - oh;
        node = on;
      } else {
        diff = oh - th;
        node = tn;
      }
      nodes.push(node);
      nodes.push(parseFloat(getComputedStyle(node).getPropertyValue('padding-bottom')) + diff + 'px');
    }
  }

  function alignNodes(content) {
    var onodes, tnodes, i, nodes;

    onodes = content[0].childNodes;
    tnodes = content[1].childNodes;

    nodes = [];
    i = onodes.length;
    while (i > 0) {
      i -= 1;
      if (onodes[i].nodeType === Node.ELEMENT_NODE) {
        pushNodeForAlign(nodes, onodes[i], tnodes[i]);
      }
    }
    requestAnimationFrame(function() {
      var i;
      i = nodes.length;
      while (i > 0) {
        i -= 2;
        nodes[i].style.paddingBottom = nodes[i + 1];
      }
    });
  }

  function initToggle(toggle1, doc, toggle2) {
    function onclick(event) {
      var style, classes;
      style = document.getElementById(doc).style;
      classes = document.body.classList;
      if (event.target.checked) {
        classes.add('both');
        document.getElementById(toggle1).checked = true;
        document.getElementById(toggle2).checked = true;
        style.display = 'block';
        alignNodes(document.getElementsByClassName('content'));
      } else {
        classes.remove('both');
        style.display = 'none';
      }
    }
    document.getElementById(toggle1).onclick = onclick;
    return onclick;
  }

  function initSwitch(label1, doc1, toggle2, doc2) {
    var toggle1;
    label1  = document.getElementById(label1);
    toggle1 = label1.nextElementSibling;

    label1.onclick = function() {
      document.body.classList.remove('both');
      document.getElementById(doc1).style.display = 'block';
      document.getElementById(doc2).style.display = 'none';
      toggle1.checked = true;
      document.getElementById(toggle2).checked = false;
    }
    return label1.onclick;
  }

  function closeDetails() {
    var d, i;
    d = document.getElementsByTagName('details');
    i = d.length;
    while (i > 0) {
      i -= 1;
      d[i].removeAttribute('open');
    }
  }

  var torus, onrus, oneng, eng, rus;

  closeDetails();

  onrus = initToggle('togglerus', 'rudoc', 'toggleeng');
  torus = initSwitch('onlyrus', 'rudoc', 'toggleeng', 'endoc');
  oneng = initToggle('toggleeng', 'endoc', 'togglerus');
  initSwitch('onlyeng', 'endoc', 'togglerus', 'rudoc');

  eng = document.getElementById('toggleeng').checked;
  rus = document.getElementById('togglerus').checked;
  /* браузер может сохранять состояние элементов input checked, но при программном считывании
   * всё равно могут быть false, будто и не сохранено */
  if (eng) {
    if (rus) {
      onrus({target : {checked : true}}); 
    }
  } else if (window.navigator.language.startsWith('ru')) {
    torus();
  }
  document.addEventListener('keydown', function(event) {
    if (!event.ctrlKey || !event.altKey) {
      ;
    } else if (event.code == 'KeyE') {
      oneng({target : {checked : true}});
    } else if (event.code == 'KeyR') {
      onrus({target : {checked : true}}); 
    }
  });
};

"use strict";

const h = document.createElement("header");
const m = document.createElement("main");
const f = document.createElement("footer");

h.innerHTML = "<h1>Super Site en JS</h1>";
f.innerHTML = `<ul><li>MENU 1</li><li>MENU 2</li><li>MENU 3</li></ul>`;
if(document.body)
    {
        document.body.append(h, m, f);
    }
for(let i = 0; i < 5; i++)
    {
        const p = document.createElement("p");
        p.textContent = "pIm qempa' tu'lum vaS chan Qargh pem nen qolotlh ghetwI' HIchDal mIllogh qonwI' qoSta' qamchIy 'ut bomwI' qelI'qam. ruDelya' rop'a' lengwI' noHva'Dut HochHom warjun 'orwI' mangghom be'nI' luSpet DeH qe'rot 'oQqar choS lurgh. peHghep jorneb qa'meH cha'qu' qawHaq QIH Sargh belHa' naD tetlh mupwI' Ho'Du' Say'moHwI' tlhagh pIch. nItebHa' muD qImlaq paw' Dech mo' nov che'ron 'eq cha'. ja'chuq poq way' raw' Say rar muD Dotlh qanwI' mISmoH SoSbor muj ghojmoH. wa' pIn gharwI' jej bIH Sun qughDo chagh. rey beq chal rIt nISwI' HIch 'e' 'och mutlhwI' Dor Doq 'ej wovbe' tlhetlh vay Qoy. vIlle' bochmoHwI' parmaqqay ghIgh be'nal raQpo' QID woj num Hup 'awje' bom lam Hergh QaywI' qeS ruDelya' puy. ";
        m.append(p);
    }

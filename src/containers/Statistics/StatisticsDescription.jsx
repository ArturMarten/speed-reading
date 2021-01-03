import React from 'react';
import ShowMore from '../../components/ShowMore/ShowMore';

function StatisticsDescription(props) {
  const { language, translate } = props;
  return (
    <ShowMore translate={translate}>
      {language === 'ee' ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="paragraph">
            Statistikas näidatakse kõigi sooritatud harjutuste andmeid nii tabeli kui ka graafiku puhul. Lisaks on
            võimalik näha kasutaja grupi koondstatistikat.
          </div>
          <div className="paragraph">
            Lugemisharjutuste statistika puhul toimub andmete töötlemine sellises järjekorras:
            <ol>
              <li>Alustatakse kasutaja kõigi lugemisandmetega</li>
              <li>
                Esmalt filtreeritakse välja kõik väärtused, kus lugemiskiirus ületab 700 sõna minutis (
                <b>juhul kui kasutaja on valinud &quot;Eemalda ebarealistlikud väärtused&quot;</b>)
              </li>
              <li>
                Seejärel leitakse nende andmete põhjal lugemiskiiruse keskväärtus ja standardhälve (SD) ning
                filtreeritakse välja andmed, mis on väljaspool 3 SD keskväärtusest (
                <b>juhul kui kasutaja on valinud &quot;Eemalda ebarealistlikud väärtused&quot;</b>)
              </li>
              <li>Filtreeritakse välja spetsiifiline lugemisharjutus (kui kasutaja on nii valinud)</li>
              <li>Filtreeritakse andmed, mis jäävad valitud ajavahemikku</li>
              <li>
                Lõpptulemusena leitud andmete põhjal arvutatakse uuesti keskväärtus ja SD ning muutus ja kuvatakse
                graafiku kohal
              </li>
            </ol>
            Schulte tabeli harjutuste statistika puhul toimub andmete töötlemine järgnevalt:
            <ol>
              <li>Alustatakse kasutaja kõigi Schulte tabeli harjutuste andmetega</li>
              <li>
                Leitakse sümbolite leidmiskiiruse alusel (sümbolit minutis) keskväärtus ja SD ning filtreeritakse välja
                andmed, mis on väljaspool 3 SD keskväärtusest (
                <b>juhul kui kasutaja on valinud &quot;Eemalda ebarealistlikud väärtused&quot;</b>)
              </li>
              <li>Filtreeritakse andmed, mis jäävad valitud ajavahemikku</li>
              <li>Leitud andmete põhjal arvutatakse uuesti keskväärtus ja SD ning kuvatakse graafiku kohal</li>
            </ol>
            Keskendumise harjutuse statistika puhul toimub andmete töötlemine järgnevalt:
            <ol>
              <li>Alustatakse kasutaja kõigi keskendumise harjutuse andmetega</li>
              <li>
                Leitakse tulemuse (%) alusel keskväärtus ja SD ning filtreeritakse välja andmed, mis on väljaspool 3 SD
                keskväärtusest (<b>juhul kui kasutaja on valinud &quot;Eemalda ebarealistlikud väärtused&quot;</b>)
              </li>
              <li>Filtreeritakse andmed, mis jäävad valitud ajavahemikku</li>
              <li>
                Leitud andmete põhjal arvutatakse uuesti tulemuse (%) keskväärtus ja SD ning kuvatakse graafiku kohal
              </li>
            </ol>
          </div>
        </div>
      ) : (
        translate('statistics.description')
      )}
    </ShowMore>
  );
}

export default StatisticsDescription;

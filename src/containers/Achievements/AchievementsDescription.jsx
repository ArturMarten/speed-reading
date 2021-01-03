import React from 'react';
import { Table } from 'semantic-ui-react';
import ShowMore from '../../components/ShowMore/ShowMore';

function AchievementsDescription(props) {
  const { language, translate } = props;
  return (
    <ShowMore translate={translate}>
      {language === 'ee' ? (
        <div className="achievements-read-more">
          <div className="paragraph">
            Saavutuste süsteemi peamine eesmärk on motiveerida kasutajat rohkem regulaarselt harjutama. Tavapärasele
            harjutuste läbimisele on seatud vahe-eesmärgid, mille poole kasutaja saab igapäevaselt püüelda, muutes
            harjutamise huvitavamaks ja mitmekülgsemaks. Erinevaid saavutusi on palju, seega alati leiab midagi sellist,
            mida võiks täita. Saavutused keskenduvad regulaarsele ja mitmekülgsele lugemise harjutamisele.
          </div>
          <div className="paragraph">
            Harjutamise hulka iseloomustame saavutustega. Saavutusi antakse erinevate ülesannete täitmise eest.
            Ülesandeks võib-olla näiteks sooritada teatud hulk harjutusi või harjutada teatud aeg. Iga saavutuse
            ülesande täitmise eest antakse kollane tähekene. Tähekeste kogus sõltub ülesande keerukusest: mida keerukam
            ülesanne, seda rohkem tähekesi antakse. Tähekestest võib mõelda kui punktidest või skoorist mõnes mängus.
            Saavutustega kogutud tähekeste arvud liidetakse kokku, mida suurem kogus tähekesi on, seda rohkem erinevaid
            saavutusi on kasutaja saanud. Kui kasutaja sooritab ühe harjutuse, siis läheb arvesse kõikide saavutuste
            puhul, mis on seotud selle harjutusega. Näiteks ühe lugemistesti harjutuse läbimisel arvestatakse seda
            kõikides saavutustes, mis on seotud harjutuste, lugemisharjutuste ja lugemistestidega. Või näiteks ühe
            Schulte tabelite harjutuse läbimisel arvestatakse seda kõikide harjutustega, abiharjutustega ja Schulte
            tabelitega seotud saavutustes. Järgnevas tabelis on harjutustega seotud saavutuste jaotumine.
          </div>
          <div className="achievements-read-more-table">
            <div className="achievements-read-more-table-inner" style={{ width: '733px' }}>
              <Table basic celled structured textAlign="center" compact="very" singleLine unstackable>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell colSpan="7">Harjutus</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell colSpan="5">Lugemisharjutus</Table.Cell>
                    <Table.Cell colSpan="2">Abiharjutus</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Lugemistest</Table.Cell>
                    <Table.Cell>Lugemise soodustaja</Table.Cell>
                    <Table.Cell>Keriv tekst</Table.Cell>
                    <Table.Cell>Kustuv tekst</Table.Cell>
                    <Table.Cell>Sõnarühmad</Table.Cell>
                    <Table.Cell>Schulte tabelid</Table.Cell>
                    <Table.Cell>Keskendumine</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
          <div className="paragraph">
            Saavutuste lehe esimene pool näitab detailsemalt, kui palju Te olete harjutanud käesoleval päeval, nädalal
            ja kuul. Päeva, nädala ja kuu saavutused on ajaliselt piiratud. See tähendab, et saavutuse saamiseks tuleb
            ülesanne täita konkreetse aja jooksul, olgu selleks siis see päev, nädal või kuu. Selle aja lõppedes
            vastavate saavutuste näitajad nullitakse ja saavutuse poole püüdlemine võib taas alata. Iga uus päev, nädal
            või kuu algab kolme saavutusega, millest kaks tükki on alati samad ja kolmas on juhuslikult valitud.
            Juhuslikult valitud saavutuse eesmärgiks on suunata kasutaja tegema erinevaid harjutusi. Päeva, nädala ja
            kuu saavutuste juures antakse ka tagasisidet kui kasutaja on keskmisest rohkem või vähem harjutanud
            võrreldes teiste kasutajatega samas grupis.
          </div>
          <div className="paragraph">
            Saavutuste lehe teises pooles on üldised saavutused, mis näitavad kogu õpingute ajal tehtud tööd. Üldiste
            saavutuste omapäraks on see, et iga saavutus on jaotatud kümneks tasemeks. Tasemetest võib mõelda kui
            vaheetappidest saavutuse viimase ülesande täitmiseks. Üldine saavutus algab nulltasemelt, iga järgmise
            taseme saamiseks tuleb täita püstitatud ülesanne. Taseme saavutamisel autasustakse kollaste tähekestega.
            Mida kõrgem tase saavutatakse, seda rohkem tähekesi antakse. Iga tasemel on saavutuse ülesande sisu sama,
            kuid iga uue tasemega kasvab ülesandes olev arvuline väärtus. Nii see arvuline väärtus kui ka antavate
            kollaste tähekeste hulk kasvab tasemega lineaarselt. Näiteks harjutuste tasemed alljärgnevas tabelis.
          </div>
          <div className="achievements-read-more-table">
            <div className="achievements-read-more-table-inner" style={{ width: '440px' }}>
              <Table basic celled structured textAlign="center" compact="very" fixed unstackable>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell></Table.Cell>
                    <Table.Cell>Soorituste arv x</Table.Cell>
                    <Table.Cell style={{ width: '200px' }}>
                      Taseme saavutamise eest teenitavate tähekeste hulk
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Tase 1</Table.Cell>
                    <Table.Cell>7</Table.Cell>
                    <Table.Cell>1</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Tase 2</Table.Cell>
                    <Table.Cell>30</Table.Cell>
                    <Table.Cell>2</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Tase 3</Table.Cell>
                    <Table.Cell>70</Table.Cell>
                    <Table.Cell>3</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Tase 4</Table.Cell>
                    <Table.Cell>120</Table.Cell>
                    <Table.Cell>4</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Tase 5</Table.Cell>
                    <Table.Cell>190</Table.Cell>
                    <Table.Cell>5</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Tase 6</Table.Cell>
                    <Table.Cell>270</Table.Cell>
                    <Table.Cell>6</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Tase 7</Table.Cell>
                    <Table.Cell>370</Table.Cell>
                    <Table.Cell>7</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Tase 8</Table.Cell>
                    <Table.Cell>480</Table.Cell>
                    <Table.Cell>8</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Tase 9</Table.Cell>
                    <Table.Cell>600</Table.Cell>
                    <Table.Cell>9</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Tase 10</Table.Cell>
                    <Table.Cell>750</Table.Cell>
                    <Table.Cell>10</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
          <p>
            Kokku kogutud tähekeste arv on päeva, nädala, kuu ja üldiste saavutuste eest kogutud tähekeste summa. Grupi
            keskmine tähekeste arvu leidmiseks liidetakse kõigi grupi kasutajate kogutud tähekeste arvud kokku ja
            jagatakse grupi kasutajate arvuga.
          </p>
        </div>
      ) : (
        translate('achievements.description')
      )}
    </ShowMore>
  );
}

export default AchievementsDescription;

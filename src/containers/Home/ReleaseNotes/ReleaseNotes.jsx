import React from 'react';
import { Header, Icon, List } from 'semantic-ui-react';

function ReleaseNotes(props) {
  return (
    <>
      <Header as="h3">
        <Icon name="announcement" color="grey" size="large" />
        {props.translate('release-notes.header')}
      </Header>
      <div style={{ maxHeight: '20em', overflowX: 'auto' }}>
        <List verticalAlign="middle" bulleted>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.21 (11.01.2020)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Sõnarühmade harjutuse fiksatsiooni asendamine lugemiskiirusega</List.Item>
                  <List.Item>Sõnarühmade harjutuse väiksemad parandused</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.20 (31.12.2019)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Lugemiskiiruse probleemile lahenduse lisamine</List.Item>
                  <List.Item>Lugemisharjutuste sujuvamaks muutmine</List.Item>
                  <List.Item>Teksti muutmine selgemaks ja teravamaks mõnede ekraani puhul</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.15 (02.06.2019)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Täiendus testi lõpetamisel</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.14 (02.04.2019)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Maksimaalse lugemiskiiruse tõstmine 700 sõnani minutis</List.Item>
                  <List.Item>Lisatud ajutine parandus lugemiskiiruse probleemile</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.13 (25.02.2019)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Uuendamise protsessi täiendused</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.12 (06.02.2019)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Schulte tabeli suuruse valik</List.Item>
                  <List.Item>Kasutusjuhendi uuendamine</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.11 (01.01.2019)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Lisatud lünkülesannete vastuste hindamine</List.Item>
                  <List.Item>Lisatud statistika graafiku polünoomina kuvamine</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.10 (02.12.2018)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Grupi statistika täiendused</List.Item>
                  <List.Item>Vigade parandused ja testimine</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.9 (12.11.2018)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Lisatud statistika ajavahemiku valik</List.Item>
                  <List.Item>Grupi statistika päringute kiiruse optimeerimine</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.8 (05.11.2018)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Lisatud grupi keskmiste statistika</List.Item>
                  <List.Item>Parandused teksti küsimuste ja vastusevariantidega</List.Item>
                  <List.Item>Vigade parandused ja testimine</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.7 (22.10.2018)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Täiendused tekstide valikul</List.Item>
                  <List.Item>Parandused statistika arvutustel</List.Item>
                  <List.Item>Rakenduse andmete automaatne uuendamine</List.Item>
                  <List.Item>Vigade parandused</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.6 (08.10.2018)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Harjutuse sätete salvestamine</List.Item>
                  <List.Item>Vigade parandused statistikas</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.5 (01.10.2018)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Täiendused kasutajaprofiilidega</List.Item>
                  <List.Item>Vigade parandused</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.4 (24.09.2018)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Lisatud võimalus teksti probleemide teatamiseks</List.Item>
                  <List.Item>Lisatud arvukalt lugemistekste (suured tänud toimetajale!)</List.Item>
                  <List.Item>Lisatud automaatne vea teatamine</List.Item>
                  <List.Item>Rakenduse esilehe täiendused</List.Item>
                  <List.Item>Pisimuudatused kujunduses</List.Item>
                  <List.Item>Vigade parandused</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.3 (17.09.2018)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Teksti huvitavuse hindamine</List.Item>
                  <List.Item>Parandused lausete sõnastustes</List.Item>
                  <List.Item>Vigade parandused</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.2 (29.08.2018)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Täiendused teksti keerukuse hindamisel</List.Item>
                  <List.Item>
                    Serverisse lisatud võimalus&nbsp;
                    <a href="http://prog.keeleressursid.ee/abstraktsus/">teksti abstraktsuse hindamiseks</a>
                  </List.Item>
                  <List.Item>Vigade parandused</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1.1 (30.06.2018)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Graafikule animatsioonide lisamine</List.Item>
                  <List.Item>Järjekorranumbri skaala lisamine</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Versioon 5.1 (07.06.2018)</List.Header>
              <List.Description>
                <List.List>
                  <List.Item>Lisatud graafikud omandamiskiirusele ja tasemele</List.Item>
                  <List.Item>Vigade parandused</List.Item>
                </List.List>
              </List.Description>
            </List.Content>
          </List.Item>
        </List>
      </div>
    </>
  );
}

export default ReleaseNotes;

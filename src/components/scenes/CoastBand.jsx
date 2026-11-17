// About band for the Coast painting: generic towers and a small train.
// The 1400-wide drawing appears twice (the second mirrored) so the band can pan; one train runs the whole length.
const Static = () => (
  <>
        
        <path className="sk-back" d="M0 240 V176 H36 V150 H84 V182 H126 V130 H176 V164 H232 V136 H286 V174 H338 V112 H392 V154 H436 V136 H494 V170 H548 V142 H648 V160 H690 V118 H744 V152 H806 V128 H860 V170 H916 V136 H970 V152 H1112 V122 H1166 V160 H1214 V130 H1276 V150 H1336 V120 H1400 V240 Z"/>
        <g className="sk-front">
          <rect x="0" y="150" width="40" height="90"/>
          <rect x="46" y="122" width="48" height="118"/>
          <rect x="104" y="138" width="40" height="102"/>
          <rect x="150" y="96" width="52" height="144"/>
          <path className="sk-line" d="M176 96 V58"/>
          <rect x="206" y="170" width="44" height="70"/>
          <rect x="256" y="100" width="62" height="140"/>
          <rect x="324" y="144" width="44" height="96"/>
          <rect x="374" y="180" width="62" height="60"/>
          <rect x="442" y="130" width="56" height="110"/>
          <rect x="504" y="156" width="50" height="84"/>
          <rect x="560" y="84" width="70" height="156"/>
          <rect x="584" y="70" width="22" height="14"/>
          <rect x="636" y="128" width="52" height="112"/>
          <rect x="694" y="116" width="52" height="124"/>
          <rect x="752" y="160" width="44" height="80"/>
          <rect x="802" y="90" width="64" height="150"/>
          <rect x="872" y="140" width="52" height="100"/>
          <rect x="930" y="170" width="54" height="70"/>
          <rect x="992" y="138" width="96" height="102"/>
          <rect x="1008" y="98" width="64" height="40"/>
          <rect x="1024" y="66" width="32" height="32"/>
          <path className="sk-line" d="M1040 66 V36"/>
          <rect x="1094" y="150" width="20" height="90"/>
          <rect x="1116" y="110" width="54" height="130"/>
          <rect x="1176" y="156" width="44" height="84"/>
          <rect x="1226" y="80" width="74" height="160"/>
          <rect x="1306" y="140" width="44" height="100"/>
          <rect x="1356" y="164" width="44" height="76"/>
        </g>
        <g className="sk-win">
          <rect x="52" y="132" width="36" height="96" fill="url(#band-win)"/>
          <rect x="156" y="106" width="40" height="122" fill="url(#band-win)"/>
          <rect x="262" y="110" width="50" height="118" fill="url(#band-win)"/>
          <rect x="448" y="140" width="44" height="88" fill="url(#band-win)"/>
          <rect x="566" y="94" width="58" height="134" fill="url(#band-win)"/>
          <rect x="642" y="138" width="40" height="90" fill="url(#band-win)"/>
          <rect x="700" y="126" width="40" height="102" fill="url(#band-win)"/>
          <rect x="808" y="100" width="52" height="128" fill="url(#band-win)"/>
          <rect x="878" y="150" width="40" height="78" fill="url(#band-win)"/>
          <rect x="998" y="148" width="84" height="80" fill="url(#band-win)"/>
          <rect x="1014" y="106" width="52" height="28" fill="url(#band-win)"/>
          <rect x="1122" y="120" width="42" height="108" fill="url(#band-win)"/>
          <rect x="1232" y="90" width="62" height="138" fill="url(#band-win)"/>
          <rect x="1312" y="150" width="32" height="78" fill="url(#band-win)"/>
        </g>
        
        
      
  </>
);

export default function CoastBand() {
  return (
    <svg className="band band-coast" viewBox="0 0 2800 240" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
      <defs>
          <pattern id="band-win" width="28" height="36" patternUnits="userSpaceOnUse"><rect x="5" y="6" width="7" height="9"/><rect x="17" y="6" width="7" height="9"/><rect x="5" y="24" width="7" height="9"/></pattern>
        </defs>
      <Static />
      <g transform="translate(2800 0) scale(-1 1)"><Static /></g>
      <rect className="sk-rail" x="0" y="234" width="2800" height="6" />
      <g className="train">
          <rect className="sk-car" x="760" y="208" width="62" height="24"/>
          <rect className="sk-car" x="826" y="208" width="62" height="24"/>
          <path className="sk-car" d="M892 208 H946 L960 222 V232 H892 Z"/>
          <rect className="sk-stripe" x="762" y="226" width="58" height="3"/><rect className="sk-stripe" x="828" y="226" width="58" height="3"/><rect className="sk-stripe" x="894" y="226" width="62" height="3"/>
          <rect className="sk-glass" x="766" y="213" width="50" height="8"/><rect className="sk-glass" x="832" y="213" width="50" height="8"/><rect className="sk-glass" x="898" y="213" width="44" height="8"/>
        </g>
    </svg>
  );
}

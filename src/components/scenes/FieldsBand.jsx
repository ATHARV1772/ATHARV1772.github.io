// About band for the Fields painting: hills, trees, farmhouses, power lines and a small train.
// The 1400-wide drawing appears twice (the second mirrored) so the band can pan; one train runs the whole length.
const Static = () => (
  <>
        <path className="fb-back" d="M0 240 V150 C120 120 220 128 330 146 C450 166 540 110 680 108 C820 106 900 150 1020 142 C1140 134 1260 100 1400 118 V240 Z"/>
        <path className="fb-mid" d="M0 240 V190 C140 170 260 176 380 188 C520 202 640 168 780 166 C920 164 1040 190 1180 184 C1280 180 1340 170 1400 172 V240 Z"/>
        <path className="fb-wire" d="M420 156 Q600 176 780 156 Q980 176 1180 156"/>
        <rect className="fb-front" x="419" y="152" width="3" height="88"/><rect className="fb-front" x="779" y="152" width="3" height="88"/><rect className="fb-front" x="1179" y="152" width="3" height="88"/>
        <g className="fb-trunk"><rect x="58" y="200" width="4" height="40"/><rect x="298" y="194" width="5" height="46"/><rect x="518" y="202" width="4" height="38"/><rect x="908" y="196" width="5" height="44"/><rect x="1228" y="198" width="4" height="42"/></g>
        <g className="fb-front"><circle cx="60" cy="194" r="22"/><circle cx="96" cy="204" r="16"/><circle cx="300" cy="186" r="26"/><circle cx="338" cy="200" r="18"/><circle cx="520" cy="196" r="20"/><circle cx="910" cy="188" r="24"/><circle cx="946" cy="202" r="16"/><circle cx="1230" cy="192" r="22"/><circle cx="1268" cy="204" r="16"/></g>
        <rect className="fb-wall" x="166" y="196" width="58" height="40"/><polygon className="fb-roof" points="158,198 195,174 232,198"/><rect className="fb-win" x="176" y="206" width="12" height="12"/><rect className="fb-door" x="200" y="212" width="12" height="24"/>
        <rect className="fb-wall" x="646" y="190" width="68" height="46"/><polygon className="fb-roof" points="638,192 660,170 700,170 722,192"/><rect className="fb-win" x="660" y="202" width="12" height="12"/><rect className="fb-win" x="688" y="202" width="12" height="12"/>
        <rect className="fb-wall" x="1086" y="200" width="50" height="36"/><polygon className="fb-roof" points="1078,202 1111,180 1144,202"/><rect className="fb-win" x="1094" y="210" width="12" height="11"/><rect className="fb-door" x="1116" y="214" width="10" height="22"/>
        
        
      
  </>
);

export default function FieldsBand() {
  return (
    <svg className="band band-fields" viewBox="0 0 2800 240" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
      
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

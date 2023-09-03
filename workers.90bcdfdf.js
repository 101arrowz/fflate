!function(){function t(t){return t&&t.__esModule?t.default:t}var e,r,n,i,a,s,o,l="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{};function h(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}/*============================================================================*/function f(t){for(var e=t.length;--e>=0;)t[e]=0}/* number of literal bytes 0..255 */var d=/* extra bits for each length code */new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),u=/* extra bits for each distance code */new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),c=/* extra bits for each bit length code */new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),_=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),p=Array(576);f(p);/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */var m=Array(60);f(m);/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */var g=Array(512);f(g);/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */var v=Array(256);f(v);/* length code for each normalized match length (0 == MIN_MATCH) */var b=Array(29);f(b);/* First normalized length for each code (0 = MIN_MATCH) */var w=Array(30);/* First normalized distance for each code (0 = distance of 1) */function y(t,e,r,n,i){this.static_tree=t,this.extra_bits=e,this.extra_base=r,this.elems=n,this.max_length=i,// show if `static_tree` has data or dummy - needed for monomorphic objects
this.has_stree=t&&t.length}function k(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}f(w);var x=function(t){return t<256?g[t]:g[256+(t>>>7)]},z=function(t,e){//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255},A=function(t,e,r){t.bi_valid>16-r?(t.bi_buf|=e<<t.bi_valid&65535,z(t,t.bi_buf),t.bi_buf=e>>16-t.bi_valid,t.bi_valid+=r-16):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=r)},S=function(t,e,r){A(t,r[2*e],r[2*e+1])},E=function(t,e){var r=0;do r|=1&t,t>>>=1,r<<=1;while(--e>0)return r>>>1},C=function(t){16===t.bi_valid?(z(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)},F=function(t,e){//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */
var r,n,i,a,s,o,l=e.dyn_tree,h=e.max_code,f=e.stat_desc.static_tree,d=e.stat_desc.has_stree,u=e.stat_desc.extra_bits,c=e.stat_desc.extra_base,_=e.stat_desc.max_length,p=0;for(a=0;a<=15;a++)t.bl_count[a]=0;for(/* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */l[2*t.heap[t.heap_max]+1]=0,r=t.heap_max+1;r<573;r++)(a=l[2*l[2*(n=t.heap[r])+1]+1]+1)>_&&(a=_,p++),l[2*n+1]=a,!(n>h)&&(/* not a leaf node */t.bl_count[a]++,s=0,n>=c&&(s=u[n-c]),o=l[2*n]/*.Freq*/,t.opt_len+=o*(a+s),d&&(t.static_len+=o*(f[2*n+1]+s)));if(0!==p){// Tracev((stderr,"\nbit length overflow\n"));
/* This happens for example on obj2 and pic of the Calgary corpus *//* Find the first bit length which could increase: */do{for(a=_-1;0===t.bl_count[a];)a--;t.bl_count[a]--,t.bl_count[a+1]+=2,t.bl_count[_]--,/* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */p-=2}while(p>0)/* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */for(a=_;0!==a;a--)for(n=t.bl_count[a];0!==n;)!((i=t.heap[--r])>h)&&(l[2*i+1]!==a&&(// Tracev((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
t.opt_len+=(a-l[2*i+1])*l[2*i]/*.Freq*/,l[2*i+1]=a),n--)}},I=function(t,e,r){//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */
var n,i,a=Array(16),s=0;/* next code value for each bit length *//* The distribution counts are first used to generate the code values
   * without bit reversal.
   */for(n=1;n<=15;n++)s=s+r[n-1]<<1,a[n]=s;/* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   *///Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
//        "inconsistent bit counts");
//Tracev((stderr,"\ngen_codes: max_code %d ", max_code));
for(i=0;i<=e;i++){var o=t[2*i+1]/*.Len*/;0!==o&&/* Now reverse the bits */(t[2*i]=E(a[o]++,o));//Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
//     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
}},R=function(){var t,e,r,s,o,l=Array(16);for(s=0,/* number of codes at each bit length for an optimal tree */// do check in _tr_init()
//if (static_init_done) return;
/* For some embedded targets, global variables are not initialized: *//*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*//* Initialize the mapping length (0..255) -> length code (0..28) */r=0;s<28;s++)for(t=0,b[s]=r;t<1<<d[s];t++)v[r++]=s;for(//Assert (length == 256, "tr_static_init: length != 256");
/* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */v[r-1]=s,/* Initialize the mapping dist (0..32K) -> dist code (0..29) */o=0,s=0;s<16;s++)for(t=0,w[s]=o;t<1<<u[s];t++)g[o++]=s;for(//Assert (dist == 256, "tr_static_init: dist != 256");
o>>=7;s<30;s++)for(t=0,w[s]=o<<7;t<1<<u[s]-7;t++)g[256+o++]=s;//Assert (dist == 256, "tr_static_init: 256+dist != 512");
/* Construct the codes of the static literal tree */for(e=0;e<=15;e++)l[e]=0;for(t=0;t<=143;)p[2*t+1]=8,t++,l[8]++;for(;t<=255;)p[2*t+1]=9,t++,l[9]++;for(;t<=279;)p[2*t+1]=7,t++,l[7]++;for(;t<=287;)p[2*t+1]=8,t++,l[8]++;/* The static distance tree is trivial: */for(/* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */I(p,287,l),t=0;t<30;t++)m[2*t+1]=5,m[2*t]=E(t,5);// Now data ready and we can init static trees
n=new y(p,d,257,286,15),i=new y(m,u,0,30,15),a=new y([],c,0,19,7);//static_init_done = true;
},O=function(t){var e;/* iterates over tree elements *//* Initialize the trees. */for(e=0;e<286;e++)t.dyn_ltree[2*e]=0;for(e=0;e<30;e++)t.dyn_dtree[2*e]=0;for(e=0;e<19;e++)t.bl_tree[2*e]=0;t.dyn_ltree[512]=1,t.opt_len=t.static_len=0,t.sym_next=t.matches=0},U=function(t){t.bi_valid>8?z(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0},T=function(t,e,r,n){var i=2*e,a=2*r;return t[i]<t[a]||t[i]===t[a]&&n[e]<=n[r]},D=function(t,e,r){for(//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */
var n=t.heap[r],i=r<<1;/* Exit if v is smaller than both sons */i<=t.heap_len&&(i<t.heap_len&&T(e,t.heap[i+1],t.heap[i],t.depth)&&i++,!T(e,n,t.heap[i],t.depth));)/* Exchange v with the smallest son */t.heap[r]=t.heap[i],r=i,/* And continue down the tree, setting j to the left son of k */i<<=1;t.heap[r]=n},B=function(t,e,r){var n,i,a,s,o=0;/* running index in sym_buf */if(0!==t.sym_next)do n=(255&t.pending_buf[t.sym_buf+o++])+((255&t.pending_buf[t.sym_buf+o++])<<8),i=t.pending_buf[t.sym_buf+o++],0===n?S(t,i,e):(S(t,/* Here, lc is the match length - MIN_MATCH */(a=v[i])+256+1,e),0!==(s=d[a])&&A(t,i-=b[a],s),//Assert (code < D_CODES, "bad d_code");
S(t,a=x(--n),r),0!==(s=u[a])&&A(t,n-=w[a],s));while(o<t.sym_next)S(t,256,e)},N=function(t,e){//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */
var r,n,i,a=e.dyn_tree,s=e.stat_desc.static_tree,o=e.stat_desc.has_stree,l=e.stat_desc.elems,h=-1;for(r=0,/* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */t.heap_len=0,t.heap_max=573;r<l;r++)0!==a[2*r]?(t.heap[++t.heap_len]=h=r,t.depth[r]=0):a[2*r+1]=0;/* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */for(;t.heap_len<2;)a[2*(i=t.heap[++t.heap_len]=h<2?++h:0)]=1,t.depth[i]=0,t.opt_len--,o&&(t.static_len-=s[2*i+1]/*.Len*/);/* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */for(e.max_code=h,r=t.heap_len>>1/*int /2*/;r>=1;r--)D(t,a,r);/* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */i=l;do //pqremove(s, tree, n);  /* n = node of least frequency */
/*** pqremove ***/r=t.heap[1/*SMALLEST*/],t.heap[1/*SMALLEST*/]=t.heap[t.heap_len--],D(t,a,1/*SMALLEST*/),/***/n=t.heap[1/*SMALLEST*/],t.heap[--t.heap_max]=r,t.heap[--t.heap_max]=n,/* Create a new node father of n and m */a[2*i]=a[2*r]+a[2*n]/*.Freq*/,t.depth[i]=(t.depth[r]>=t.depth[n]?t.depth[r]:t.depth[n])+1,a[2*r+1]=a[2*n+1]=i,/* and insert the new node in the heap */t.heap[1/*SMALLEST*/]=i++,D(t,a,1/*SMALLEST*/);while(t.heap_len>=2)t.heap[--t.heap_max]=t.heap[1/*SMALLEST*/],/* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */F(t,e),/* The field len is now set, we can generate the bit codes */I(a,h,t.bl_count)},L=function(t,e,r){var n,i,a=-1,s=e[1]/*.Len*/,o=0,l=7,h=4;/* last emitted length */for(0===s&&(l=138,h=3),e[(r+1)*2+1]=65535,n=0;n<=r;n++)i=s,s=e[(n+1)*2+1]/*.Len*/,++o<l&&i===s||(o<h?t.bl_tree[2*i]+=o:0!==i?(i!==a&&t.bl_tree[2*i]++,t.bl_tree[32]++):o<=10?t.bl_tree[34]++:t.bl_tree[36]++,o=0,a=i,0===s?(l=138,h=3):i===s?(l=6,h=3):(l=7,h=4))},Z=function(t,e,r){var n,i,a=-1,s=e[1]/*.Len*/,o=0,l=7,h=4;/* last emitted length */for(0===s&&(l=138,h=3),n=0;n<=r;n++)if(i=s,s=e[(n+1)*2+1]/*.Len*/,!(++o<l)||i!==s){if(o<h)do S(t,i,t.bl_tree);while(0!=--o)else 0!==i?(i!==a&&(S(t,i,t.bl_tree),o--),//Assert(count >= 3 && count <= 6, " 3_6?");
S(t,16,t.bl_tree),A(t,o-3,2)):o<=10?(S(t,17,t.bl_tree),A(t,o-3,3)):(S(t,18,t.bl_tree),A(t,o-11,7));o=0,a=i,0===s?(l=138,h=3):i===s?(l=6,h=3):(l=7,h=4)}},P=function(t){var e;/* index of last bit length code of non zero freq *//* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   *//* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */for(/* Determine the bit length frequencies for literal and distance trees */L(t,t.dyn_ltree,t.l_desc.max_code),L(t,t.dyn_dtree,t.d_desc.max_code),/* Build the bit length tree: */N(t,t.bl_desc),e=18;e>=3&&0===t.bl_tree[2*_[e]+1];e--);//Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
//        s->opt_len, s->static_len));
return(/* Update opt_len to include the bit length tree and counts */t.opt_len+=3*(e+1)+5+5+4,e)},j=function(t,e,r,n){//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
var i;/* index in bl_order */for(//Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
//Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
//        "too many codes");
//Tracev((stderr, "\nbl counts: "));
A(t,e-257,5),A(t,r-1,5),A(t,n-4,4),i=0;i<n;i++)A(t,t.bl_tree[2*_[i]+1],3);//Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));
Z(t,t.dyn_ltree,e-1),//Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));
Z(t,t.dyn_dtree,r-1);//Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
},M=function(t){/* block_mask is the bit mask of block-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */var e,r=4093624447;/* Check for non-textual ("block-listed") bytes. */for(e=0;e<=31;e++,r>>>=1)if(1&r&&0!==t.dyn_ltree[2*e])return 0;/* Check for textual ("allow-listed") bytes. */if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return 1;for(e=32;e<256;e++)if(0!==t.dyn_ltree[2*e])return 1;/* There are no "block-listed" or "allow-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */return 0},W=!1,H=function(t,e,r,n){//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
A(t,0+(n?1:0),3),U(t),z(t,r),z(t,~r),r&&t.pending_buf.set(t.window.subarray(e,e+r),t.pending),t.pending+=r},G={_tr_init:function(t){W||(R(),W=!0),t.l_desc=new k(t.dyn_ltree,n),t.d_desc=new k(t.dyn_dtree,i),t.bl_desc=new k(t.bl_tree,a),t.bi_buf=0,t.bi_valid=0,/* Initialize the first block of the first file: */O(t)},_tr_stored_block:H,_tr_flush_block:function(t,e,r,n){var i,a,s=0;/* index of last bit length code of non zero freq */t.level>0?(2===t.strm.data_type&&(t.strm.data_type=M(t)),/* Construct the literal and distance trees */N(t,t.l_desc),// Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
//        s->static_len));
N(t,t.d_desc),// Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
//        s->static_len));
/* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     *//* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */s=P(t),/* Determine the best encoding. Compute the block lengths in bytes. */i=t.opt_len+3+7>>>3,(a=t.static_len+3+7>>>3)<=i&&(i=a)):i=a=r+5,r+4<=i&&-1!==e?/* 4: two words for the lengths *//* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */H(t,e,r,n):4===t.strategy||a===i?(A(t,2+(n?1:0),3),B(t,p,m)):(A(t,4+(n?1:0),3),j(t,t.l_desc.max_code+1,t.d_desc.max_code+1,s+1),B(t,t.dyn_ltree,t.dyn_dtree)),// Assert (s->compressed_len == s->bits_sent, "bad compressed size");
/* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */O(t),n&&U(t);// Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
//       s->compressed_len-7*last));
},_tr_tally:function(t,e,r){return(//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
t.pending_buf[t.sym_buf+t.sym_next++]=e,t.pending_buf[t.sym_buf+t.sym_next++]=e>>8,t.pending_buf[t.sym_buf+t.sym_next++]=r,0===e?/* lc is the unmatched char */t.dyn_ltree[2*r]++:(t.matches++,/* Here, lc is the match length - MIN_MATCH */e--,//Assert((ush)dist < (ush)MAX_DIST(s) &&
//       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
//       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");
t.dyn_ltree[(v[r]+256+1)*2]++,t.dyn_dtree[2*x(e)]++),t.sym_next===t.sym_end)},_tr_align:function(t){A(t,2,3),S(t,256,p),C(t)}},K=function(t,e,r,n){for(var i=65535&t|0,a=t>>>16&65535|0,s=0;0!==r;){// Set limit ~ twice less than 5552, to keep
// s2 in 31-bits, because we force signed ints.
// in other case %= will fail.
s=r>2e3?2e3:r,r-=s;do a=a+(i=i+e[n++]|0)|0;while(--s)i%=65521,a%=65521}return i|a<<16|0},Y=new Uint32Array(function(){for(var t,e=[],r=0;r<256;r++){t=r;for(var n=0;n<8;n++)t=1&t?3988292384^t>>>1:t>>>1;e[r]=t}return e}()),X=function(t,e,r,n){var i=n+r;t^=-1;for(var a=n;a<i;a++)t=t>>>8^Y[(t^e[a])&255];return -1^t;// >>> 0;
},V={2:"need dictionary",/* Z_NEED_DICT       2  */1:"stream end",/* Z_STREAM_END      1  */0:"",/* Z_OK              0  */"-1":"file error",/* Z_ERRNO         (-1) */"-2":"stream error",/* Z_STREAM_ERROR  (-2) */"-3":"data error",/* Z_DATA_ERROR    (-3) */"-4":"insufficient memory",/* Z_MEM_ERROR     (-4) */"-5":"buffer error",/* Z_BUF_ERROR     (-5) */"-6":"incompatible version"/* Z_VERSION_ERROR (-6) */},J={/* Allowed flush values; see deflate() and inflate() below for details */Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,/* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,//Z_ASCII:                1, // = Z_TEXT (deprecated)
Z_UNKNOWN:2,/* The deflate compression method */Z_DEFLATED:8},q=G._tr_init,$=G._tr_stored_block,Q=G._tr_flush_block,tt=G._tr_tally,te=G._tr_align,tr=J.Z_NO_FLUSH,tn=J.Z_PARTIAL_FLUSH,ti=J.Z_FULL_FLUSH,ta=J.Z_FINISH,ts=J.Z_BLOCK,to=J.Z_OK,tl=J.Z_STREAM_END,th=J.Z_STREAM_ERROR,tf=J.Z_DATA_ERROR,td=J.Z_BUF_ERROR,tu=J.Z_DEFAULT_COMPRESSION,tc=J.Z_FILTERED,t_=J.Z_HUFFMAN_ONLY,tp=J.Z_RLE,tm=J.Z_FIXED,tg=J.Z_DEFAULT_STRATEGY,tv=J.Z_UNKNOWN,tb=J.Z_DEFLATED,tw=function(t,e){return t.msg=V[e],e},ty=function(t){return 2*t-(t>4?9:0)},tk=function(t){for(var e=t.length;--e>=0;)t[e]=0},tx=function(t){var e,r,n,i=t.w_size;n=e=t.hash_size;do r=t.head[--n],t.head[n]=r>=i?r-i:0;while(--e)//#ifndef FASTEST
n=e=i;do r=t.prev[--n],t.prev[n]=r>=i?r-i:0;while(--e)//#endif
},tz=function(t,e,r){return(e<<t.hash_shift^r)&t.hash_mask},tA=function(t){var e=t.state,r=e.pending;r>t.avail_out&&(r=t.avail_out),0!==r&&(t.output.set(e.pending_buf.subarray(e.pending_out,e.pending_out+r),t.next_out),t.next_out+=r,e.pending_out+=r,t.total_out+=r,t.avail_out-=r,e.pending-=r,0===e.pending&&(e.pending_out=0))},tS=function(t,e){Q(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,tA(t.strm)},tE=function(t,e){t.pending_buf[t.pending++]=e},tC=function(t,e){//  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e},tF=function(t,e,r,n){var i=t.avail_in;return(i>n&&(i=n),0===i)?0:(t.avail_in-=i,// zmemcpy(buf, strm->next_in, len);
e.set(t.input.subarray(t.next_in,t.next_in+i),r),1===t.state.wrap?t.adler=K(t.adler,e,i,r):2===t.state.wrap&&(t.adler=X(t.adler,e,i,r)),t.next_in+=i,t.total_in+=i,i)},tI=function(t,e){var r,n,i=t.max_chain_length,a=t.strstart,s=t.prev_length,o=t.nice_match,l=t.strstart>t.w_size-262?t.strstart-(t.w_size-262):0/*NIL*/,h=t.window,f=t.w_mask,d=t.prev,u=t.strstart+258,c=h[a+s-1],_=h[a+s];/* max hash chain length */t.prev_length>=t.good_match&&(i>>=2),o>t.lookahead&&(o=t.lookahead);// Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");
do{/* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */if(h[// Assert(cur_match < s->strstart, "no future");
(r=e)+s]!==_||h[r+s-1]!==c||h[r]!==h[a]||h[++r]!==h[a+1])continue;/* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */a+=2,r++;// Assert(*scan == *match, "match[2]?");
/* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */do;while(h[++a]===h[++r]&&h[++a]===h[++r]&&h[++a]===h[++r]&&h[++a]===h[++r]&&h[++a]===h[++r]&&h[++a]===h[++r]&&h[++a]===h[++r]&&h[++a]===h[++r]&&a<u)if(// Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");
n=258-(u-a),a=u-258,n>s){if(t.match_start=e,s=n,n>=o)break;c=h[a+s-1],_=h[a+s]}}while((e=d[e&f])>l&&0!=--i)return s<=t.lookahead?s:t.lookahead},tR=function(t){var e,r,n,i=t.w_size;//Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");
do{if(r=t.window_size-t.lookahead-t.strstart,t.strstart>=i+(i-262)&&(t.window.set(t.window.subarray(i,i+i-r),0),t.match_start-=i,t.strstart-=i,/* we now have strstart >= MAX_DIST */t.block_start-=i,t.insert>t.strstart&&(t.insert=t.strstart),tx(t),r+=i),0===t.strm.avail_in)break;/* Initialize the hash value now that we have some input: */if(/* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     *///Assert(more >= 2, "more < 2");
e=tF(t.strm,t.window,t.strstart+t.lookahead,r),t.lookahead+=e,t.lookahead+t.insert>=3)//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
for(n=t.strstart-t.insert,t.ins_h=t.window[n],/* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */t.ins_h=tz(t,t.ins_h,t.window[n+1]);t.insert&&(/* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */t.ins_h=tz(t,t.ins_h,t.window[n+3-1]),t.prev[n&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=n,n++,t.insert--,!(t.lookahead+t.insert<3)););/* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */}while(t.lookahead<262&&0!==t.strm.avail_in)/* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   *///  if (s.high_water < s.window_size) {
//    const curr = s.strstart + s.lookahead;
//    let init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
},tO=function(t,e){/* Smallest worthy block size when not flushing or finishing. By default
   * this is 32K. This can be as small as 507 bytes for memLevel == 1. For
   * large input and output buffers, the stored block size will be larger.
   */var r,n,i,a=t.pending_buf_size-5>t.w_size?t.w_size:t.pending_buf_size-5,s=0,o=t.strm.avail_in;do{if(/* Set len to the maximum size block that we can copy directly with the
     * available input data and output space. Set left to how much of that
     * would be copied from what's left in the window.
     */r=65535/* MAX_STORED */,i=t.bi_valid+42>>3,t.strm.avail_out<i||(/* maximum stored block length that will fit in avail_out: */i=t.strm.avail_out-i,r>(n=t.strstart-t.block_start)+t.strm.avail_in&&(r=n+t.strm.avail_in),r>i&&(r=i),r<a&&(0===r&&e!==ta||e===tr||r!==n+t.strm.avail_in)))break;/* Make a dummy stored block in pending to get the header bytes,
     * including any pending bits. This also updates the debugging counts.
     */s=e===ta&&r===n+t.strm.avail_in?1:0,$(t,0,0,s),/* Replace the lengths in the dummy stored block with len. */t.pending_buf[t.pending-4]=r,t.pending_buf[t.pending-3]=r>>8,t.pending_buf[t.pending-2]=~r,t.pending_buf[t.pending-1]=~r>>8,/* Write the stored block header bytes. */tA(t.strm),n&&(n>r&&(n=r),//zmemcpy(s->strm->next_out, s->window + s->block_start, left);
t.strm.output.set(t.window.subarray(t.block_start,t.block_start+n),t.strm.next_out),t.strm.next_out+=n,t.strm.avail_out-=n,t.strm.total_out+=n,t.block_start+=n,r-=n),r&&(tF(t.strm,t.strm.output,t.strm.next_out,r),t.strm.next_out+=r,t.strm.avail_out-=r,t.strm.total_out+=r)}while(0===s)return/* If the last block was written to next_out, then done. */(/* Update the sliding window with the last s->w_size bytes of the copied
   * data, or append all of the copied data to the existing window if less
   * than s->w_size bytes were copied. Also update the number of bytes to
   * insert in the hash tables, in the event that deflateParams() switches to
   * a non-zero compression level.
   */(o-=t.strm.avail_in)&&(o>=t.w_size?(t.matches=2,//zmemcpy(s->window, s->strm->next_in - s->w_size, s->w_size);
t.window.set(t.strm.input.subarray(t.strm.next_in-t.w_size,t.strm.next_in),0),t.strstart=t.w_size,t.insert=t.strstart):(t.window_size-t.strstart<=o&&(/* Slide the window down. */t.strstart-=t.w_size,//zmemcpy(s->window, s->window + s->w_size, s->strstart);
t.window.set(t.window.subarray(t.w_size,t.w_size+t.strstart),0),t.matches<2&&t.matches++,t.insert>t.strstart&&(t.insert=t.strstart)),//zmemcpy(s->window + s->strstart, s->strm->next_in - used, used);
t.window.set(t.strm.input.subarray(t.strm.next_in-o,t.strm.next_in),t.strstart),t.strstart+=o,t.insert+=o>t.w_size-t.insert?t.w_size-t.insert:o),t.block_start=t.strstart),t.high_water<t.strstart&&(t.high_water=t.strstart),s)?4:e!==tr&&e!==ta&&0===t.strm.avail_in&&t.strstart===t.block_start?2:(/* Fill the window with any remaining input. */i=t.window_size-t.strstart,t.strm.avail_in>i&&t.block_start>=t.w_size&&(/* Slide the window down. */t.block_start-=t.w_size,t.strstart-=t.w_size,//zmemcpy(s->window, s->window + s->w_size, s->strstart);
t.window.set(t.window.subarray(t.w_size,t.w_size+t.strstart),0),t.matches<2&&t.matches++,i+=t.w_size,t.insert>t.strstart&&(t.insert=t.strstart)),i>t.strm.avail_in&&(i=t.strm.avail_in),i&&(tF(t.strm,t.window,t.strstart,i),t.strstart+=i,t.insert+=i>t.w_size-t.insert?t.w_size-t.insert:i),t.high_water<t.strstart&&(t.high_water=t.strstart),/* There was not enough avail_out to write a complete worthy or flushed
   * stored block to next_out. Write a stored block to pending instead, if we
   * have enough input for a worthy block, or if flushing and there is enough
   * room for the remaining input as a stored block in the pending buffer.
   */i=t.bi_valid+42>>3,a=/* maximum stored block length that will fit in pending: */(i=t.pending_buf_size-i>65535/* MAX_STORED */?65535/* MAX_STORED */:t.pending_buf_size-i)>t.w_size?t.w_size:i,((n=t.strstart-t.block_start)>=a||(n||e===ta)&&e!==tr&&0===t.strm.avail_in&&n<=i)&&(r=n>i?i:n,s=e===ta&&0===t.strm.avail_in&&r===n?1:0,$(t,t.block_start,r,s),t.block_start+=r,tA(t.strm)),s?3:1)},tU=function(t,e){for(var r,n;;){/* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */if(t.lookahead<262){if(tR(t),t.lookahead<262&&e===tr)return 1;if(0===t.lookahead)break;/* flush the current block */}if(/* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */r=0/*NIL*/,t.lookahead>=3&&(/*** INSERT_STRING(s, s.strstart, hash_head); ***/t.ins_h=tz(t,t.ins_h,t.window[t.strstart+3-1]),r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0/*NIL*/!==r&&t.strstart-r<=t.w_size-262&&/* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */(t.match_length=tI(t,r)),t.match_length>=3){/* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */if(// check_match(s, s.strstart, s.match_start, s.match_length); // for debug only
/*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/n=tt(t,t.strstart-t.match_start,t.match_length-3),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match/*max_insert_length*/&&t.lookahead>=3){t.match_length--;/* string at strstart already in table */do t.strstart++,/*** INSERT_STRING(s, s.strstart, hash_head); ***/t.ins_h=tz(t,t.ins_h,t.window[t.strstart+3-1]),r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart;while(0!=--t.match_length)t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],/* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */t.ins_h=tz(t,t.ins_h,t.window[t.strstart+1])}else /* No match, output a literal byte *///Tracevv((stderr,"%c", s.window[s.strstart]));
/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/n=tt(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(n&&(/*** FLUSH_BLOCK(s, 0); ***/tS(t,!1),0===t.strm.avail_out))return 1}return(t.insert=t.strstart<2?t.strstart:2,e===ta)?(/*** FLUSH_BLOCK(s, 1); ***/tS(t,!0),0===t.strm.avail_out)?3:4:t.sym_next&&(/*** FLUSH_BLOCK(s, 0); ***/tS(t,!1),0===t.strm.avail_out)?1:2},tT=function(t,e){/* Process the input block. */for(var r,n,i;;){/* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */if(t.lookahead<262){if(tR(t),t.lookahead<262&&e===tr)return 1;if(0===t.lookahead)break;/* flush the current block */}/* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */if(/* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */r=0/*NIL*/,t.lookahead>=3&&(/*** INSERT_STRING(s, s.strstart, hash_head); ***/t.ins_h=tz(t,t.ins_h,t.window[t.strstart+3-1]),r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),/* Find the longest match, discarding those <= prev_length.
     */t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=2,0/*NIL*/!==r&&t.prev_length<t.max_lazy_match&&t.strstart-r<=t.w_size-262&&(/* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */t.match_length=tI(t,r),t.match_length<=5&&(t.strategy===tc||3===t.match_length&&t.strstart-t.match_start>4096/*TOO_FAR*/)&&/* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */(t.match_length=2)),t.prev_length>=3&&t.match_length<=t.prev_length){i=t.strstart+t.lookahead-3,/* Do not insert strings in hash table beyond this. *///check_match(s, s.strstart-1, s.prev_match, s.prev_length);
/***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/n=tt(t,t.strstart-1-t.prev_match,t.prev_length-3),/* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */t.lookahead-=t.prev_length-1,t.prev_length-=2;do++t.strstart<=i&&(/*** INSERT_STRING(s, s.strstart, hash_head); ***/t.ins_h=tz(t,t.ins_h,t.window[t.strstart+3-1]),r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart);while(0!=--t.prev_length)if(t.match_available=0,t.match_length=2,t.strstart++,n&&(/*** FLUSH_BLOCK(s, 0); ***/tS(t,!1),0===t.strm.avail_out))return 1}else if(t.match_available){if(/* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       *///Tracevv((stderr,"%c", s->window[s->strstart-1]));
/*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/(n=tt(t,0,t.window[t.strstart-1]))&&/*** FLUSH_BLOCK_ONLY(s, 0) ***/tS(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return 1}else /* There is no previous match to compare with, wait for
       * the next step to decide.
       */t.match_available=1,t.strstart++,t.lookahead--}return(t.match_available&&(//Tracevv((stderr,"%c", s->window[s->strstart-1]));
/*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/n=tt(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<2?t.strstart:2,e===ta)?(/*** FLUSH_BLOCK(s, 1); ***/tS(t,!0),0===t.strm.avail_out)?3:4:t.sym_next&&(/*** FLUSH_BLOCK(s, 0); ***/tS(t,!1),0===t.strm.avail_out)?1:2},tD=function(t,e){for(var r,n,i,a,s=t.window;;){/* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */if(t.lookahead<=258){if(tR(t),t.lookahead<=258&&e===tr)return 1;if(0===t.lookahead)break;/* flush the current block */}if(/* See how many times the previous byte repeats */t.match_length=0,t.lookahead>=3&&t.strstart>0&&(n=s[i=t.strstart-1])===s[++i]&&n===s[++i]&&n===s[++i]){a=t.strstart+258;do;while(n===s[++i]&&n===s[++i]&&n===s[++i]&&n===s[++i]&&n===s[++i]&&n===s[++i]&&n===s[++i]&&n===s[++i]&&i<a)t.match_length=258-(a-i),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=3?(//check_match(s, s.strstart, s.strstart - 1, s.match_length);
/*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/r=tt(t,1,t.match_length-3),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(/* No match, output a literal byte *///Tracevv((stderr,"%c", s->window[s->strstart]));
/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/r=tt(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),r&&(/*** FLUSH_BLOCK(s, 0); ***/tS(t,!1),0===t.strm.avail_out))return 1}return(t.insert=0,e===ta)?(/*** FLUSH_BLOCK(s, 1); ***/tS(t,!0),0===t.strm.avail_out)?3:4:t.sym_next&&(/*** FLUSH_BLOCK(s, 0); ***/tS(t,!1),0===t.strm.avail_out)?1:2},tB=function(t,e){for(var r;;){/* Make sure that we have a literal to write. */if(0===t.lookahead&&(tR(t),0===t.lookahead)){if(e===tr)return 1;break;/* flush the current block */}if(/* Output a literal byte */t.match_length=0,//Tracevv((stderr,"%c", s->window[s->strstart]));
/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/r=tt(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,r&&(/*** FLUSH_BLOCK(s, 0); ***/tS(t,!1),0===t.strm.avail_out))return 1}return(t.insert=0,e===ta)?(/*** FLUSH_BLOCK(s, 1); ***/tS(t,!0),0===t.strm.avail_out)?3:4:t.sym_next&&(/*** FLUSH_BLOCK(s, 0); ***/tS(t,!1),0===t.strm.avail_out)?1:2};/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */function tN(t,e,r,n,i){this.good_length=t,this.max_lazy=e,this.nice_length=r,this.max_chain=n,this.func=i}var tL=[/*      good lazy nice chain */new tN(0,0,0,0,tO),/* 0 store only */new tN(4,4,8,4,tU),/* 1 max speed, no lazy matches */new tN(4,5,16,8,tU),/* 2 */new tN(4,6,32,32,tU),/* 3 */new tN(4,4,16,16,tT),/* 4 lazy matches */new tN(8,16,32,32,tT),/* 5 */new tN(8,16,128,128,tT),/* 6 */new tN(8,32,128,256,tT),/* 7 */new tN(32,128,258,1024,tT),/* 8 */new tN(32,258,258,4096,tT)],tZ=function(t){t.window_size=2*t.w_size,/*** CLEAR_HASH(s); ***/tk(t.head),/* Set the default configuration parameters:
   */t.max_lazy_match=tL[t.level].max_lazy,t.good_match=tL[t.level].good_length,t.nice_match=tL[t.level].nice_length,t.max_chain_length=tL[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=2,t.match_available=0,t.ins_h=0};function tP(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=tb,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,/* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */this.window_size=0,/* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */this.prev=null,/* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,/* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */this.block_start=0,/* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,/* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */this.max_chain_length=0,/* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */this.max_lazy_match=0,/* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */// That's alias to max_lazy_match, don't use directly
//this.max_insert_length = 0;
/* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */this.level=0,this.strategy=0,this.good_match=0,/* Use a faster search when the previous match is longer than this */this.nice_match=0,/* used by trees.c: *//* Didn't use ct_data typedef below to suppress compiler warning */// struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
// struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
// struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */
// Use flat array of DOUBLE size, with interleaved fata,
// because JS does not support effective
this.dyn_ltree=new Uint16Array(1146),this.dyn_dtree=new Uint16Array(122),this.bl_tree=new Uint16Array(78),tk(this.dyn_ltree),tk(this.dyn_dtree),tk(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,//ush bl_count[MAX_BITS+1];
this.bl_count=new Uint16Array(16),/* number of codes at each bit length for an optimal tree *///int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
this.heap=new Uint16Array(573),tk(this.heap),this.heap_len=0,this.heap_max=0,/* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */this.depth=new Uint16Array(573),tk(this.depth),/* Depth of each subtree used as tie breaker for trees of equal frequency
   */this.sym_buf=0,this.lit_bufsize=0,/* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */this.sym_next=0,this.sym_end=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,/* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */this.bi_valid=0;/* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */// Used for window memory init. We safely ignore it for JS. That makes
// sense only for pointers and memory check tools.
//this.high_water = 0;
/* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */}/* =========================================================================
 * Check for a valid deflate stream state. Return 0 if ok, 1 if not.
 */var tj=function(t){if(!t)return 1;var e=t.state;return e&&e.strm===t&&(42===e.status||//#ifdef GZIP
57===e.status||//#endif
69===e.status||73===e.status||91===e.status||103===e.status||113===e.status||666===e.status)?0:1},tM=function(t){if(tj(t))return tw(t,th);t.total_in=t.total_out=0,t.data_type=tv;var e=t.state;return e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=2===e.wrap?57:e.wrap?42:113,t.adler=2===e.wrap?0// crc32(0, Z_NULL, 0)
:1,e.last_flush=-2,q(e),to},tW=function(t){var e=tM(t);return e===to&&tZ(t.state),e},tH=function(t,e,r,n,i,a){if(!t)return th;var s=1;if(e===tu&&(e=6),n<0?(s=0,n=-n):n>15&&(s=2,n-=16),i<1||i>9||r!==tb||n<8||n>15||e<0||e>9||a<0||a>tm||8===n&&1!==s)return tw(t,th);8===n&&(n=9);/* until 256-byte window bug fixed */var o=new tP;return t.state=o,o.strm=t,o.status=42,o.wrap=s,o.gzhead=null,o.w_bits=n,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=i+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+3-1)/3),o.window=new Uint8Array(2*o.w_size),o.head=new Uint16Array(o.hash_size),o.prev=new Uint16Array(o.w_size),// Don't need mem init magic for JS.
//s.high_water = 0;  /* nothing written to s->window yet */
o.lit_bufsize=1<<i+6,/* We overlay pending_buf and sym_buf. This works since the average size
   * for length/distance pairs over any compressed block is assured to be 31
   * bits or less.
   *
   * Analysis: The longest fixed codes are a length code of 8 bits plus 5
   * extra bits, for lengths 131 to 257. The longest fixed distance codes are
   * 5 bits plus 13 extra bits, for distances 16385 to 32768. The longest
   * possible fixed-codes length/distance pair is then 31 bits total.
   *
   * sym_buf starts one-fourth of the way into pending_buf. So there are
   * three bytes in sym_buf for every four bytes in pending_buf. Each symbol
   * in sym_buf is three bytes -- two for the distance and one for the
   * literal/length. As each symbol is consumed, the pointer to the next
   * sym_buf value to read moves forward three bytes. From that symbol, up to
   * 31 bits are written to pending_buf. The closest the written pending_buf
   * bits gets to the next sym_buf symbol to read is just before the last
   * code is written. At that time, 31*(n-2) bits have been written, just
   * after 24*(n-2) bits have been consumed from sym_buf. sym_buf starts at
   * 8*n bits into pending_buf. (Note that the symbol buffer fills when n-1
   * symbols are written.) The closest the writing gets to what is unread is
   * then n+14 bits. Here n is lit_bufsize, which is 16384 by default, and
   * can range from 128 to 32768.
   *
   * Therefore, at a minimum, there are 142 bits of space between what is
   * written and what is read in the overlain buffers, so the symbols cannot
   * be overwritten by the compressed data. That space is actually 139 bits,
   * due to the three-bit fixed-code block header.
   *
   * That covers the case where either Z_FIXED is specified, forcing fixed
   * codes, or when the use of fixed codes is chosen, because that choice
   * results in a smaller compressed block than dynamic codes. That latter
   * condition then assures that the above analysis also covers all dynamic
   * blocks. A dynamic-code block will only be chosen to be emitted if it has
   * fewer bits than a fixed-code block would for the same set of symbols.
   * Therefore its average symbol length is assured to be less than 31. So
   * the compressed data for a dynamic block also cannot overwrite the
   * symbols from which it is being constructed.
   */o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new Uint8Array(o.pending_buf_size),// It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
//s->sym_buf = s->pending_buf + s->lit_bufsize;
o.sym_buf=o.lit_bufsize,//s->sym_end = (s->lit_bufsize - 1) * 3;
o.sym_end=(o.lit_bufsize-1)*3,/* We avoid equality with lit_bufsize*3 because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */o.level=e,o.strategy=a,o.method=r,tW(t)},tG={deflateInit:function(t,e){return tH(t,e,tb,15,8,tg)},deflateInit2:tH,deflateReset:tW,deflateResetKeep:tM,deflateSetHeader:function(t,e){return tj(t)||2!==t.state.wrap?th:(t.state.gzhead=e,to)},deflate:function(t,e){if(tj(t)||e>ts||e<0)return t?tw(t,th):th;var r=t.state;if(!t.output||0!==t.avail_in&&!t.input||666===r.status&&e!==ta)return tw(t,0===t.avail_out?td:th);var n=r.last_flush;/* Flush as much pending output as possible */if(r.last_flush=e,0!==r.pending){if(tA(t),0===t.avail_out)return(/* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */r.last_flush=-1,to)}else if(0===t.avail_in&&ty(e)<=ty(n)&&e!==ta)return tw(t,td);/* User must not provide more input after the first FINISH: */if(666===r.status&&0!==t.avail_in)return tw(t,td);if(42===r.status&&0===r.wrap&&(r.status=113),42===r.status){/* zlib header */var i=tb+(r.w_bits-8<<4)<<8;if(i|=(r.strategy>=t_||r.level<2?0:r.level<6?1:6===r.level?2:3)<<6,0!==r.strstart&&(i|=32),tC(r,i+=31-i%31),0!==r.strstart&&(tC(r,t.adler>>>16),tC(r,65535&t.adler)),t.adler=1,r.status=113,/* Compression must start with an empty pending buffer */tA(t),0!==r.pending)return r.last_flush=-1,to}//#ifdef GZIP
if(57===r.status){if(/* gzip header */t.adler=0,tE(r,31),tE(r,139),tE(r,8),r.gzhead)tE(r,(r.gzhead.text?1:0)+(r.gzhead.hcrc?2:0)+(r.gzhead.extra?4:0)+(r.gzhead.name?8:0)+(r.gzhead.comment?16:0)),tE(r,255&r.gzhead.time),tE(r,r.gzhead.time>>8&255),tE(r,r.gzhead.time>>16&255),tE(r,r.gzhead.time>>24&255),tE(r,9===r.level?2:r.strategy>=t_||r.level<2?4:0),tE(r,255&r.gzhead.os),r.gzhead.extra&&r.gzhead.extra.length&&(tE(r,255&r.gzhead.extra.length),tE(r,r.gzhead.extra.length>>8&255)),r.gzhead.hcrc&&(t.adler=X(t.adler,r.pending_buf,r.pending,0)),r.gzindex=0,r.status=69;else if(tE(r,0),tE(r,0),tE(r,0),tE(r,0),tE(r,0),tE(r,9===r.level?2:r.strategy>=t_||r.level<2?4:0),tE(r,3),r.status=113,/* Compression must start with an empty pending buffer */tA(t),0!==r.pending)return r.last_flush=-1,to}if(69===r.status){if(r.gzhead.extra/* != Z_NULL*/){for(var a=r.pending,s=(65535&r.gzhead.extra.length)-r.gzindex;r.pending+s>r.pending_buf_size;){var o=r.pending_buf_size-r.pending;if(// zmemcpy(s.pending_buf + s.pending,
//    s.gzhead.extra + s.gzindex, copy);
r.pending_buf.set(r.gzhead.extra.subarray(r.gzindex,r.gzindex+o),r.pending),r.pending=r.pending_buf_size,r.gzhead.hcrc&&r.pending>a&&(t.adler=X(t.adler,r.pending_buf,r.pending-a,a)),//---//
r.gzindex+=o,tA(t),0!==r.pending)return r.last_flush=-1,to;a=0,s-=o}// JS specific: s.gzhead.extra may be TypedArray or Array for backward compatibility
//              TypedArray.slice and TypedArray.from don't exist in IE10-IE11
var l=new Uint8Array(r.gzhead.extra);// zmemcpy(s->pending_buf + s->pending,
//     s->gzhead->extra + s->gzindex, left);
r.pending_buf.set(l.subarray(r.gzindex,r.gzindex+s),r.pending),r.pending+=s,r.gzhead.hcrc&&r.pending>a&&(t.adler=X(t.adler,r.pending_buf,r.pending-a,a)),//---//
r.gzindex=0}r.status=73}if(73===r.status){if(r.gzhead.name/* != Z_NULL*/){var h,f=r.pending;/* start of bytes to update crc */do{if(r.pending===r.pending_buf_size){if(r.gzhead.hcrc&&r.pending>f&&(t.adler=X(t.adler,r.pending_buf,r.pending-f,f)),//---//
tA(t),0!==r.pending)return r.last_flush=-1,to;f=0}h=r.gzindex<r.gzhead.name.length?255&r.gzhead.name.charCodeAt(r.gzindex++):0,tE(r,h)}while(0!==h)r.gzhead.hcrc&&r.pending>f&&(t.adler=X(t.adler,r.pending_buf,r.pending-f,f)),//---//
r.gzindex=0}r.status=91}if(91===r.status){if(r.gzhead.comment/* != Z_NULL*/){var d,u=r.pending;/* start of bytes to update crc */do{if(r.pending===r.pending_buf_size){if(r.gzhead.hcrc&&r.pending>u&&(t.adler=X(t.adler,r.pending_buf,r.pending-u,u)),//---//
tA(t),0!==r.pending)return r.last_flush=-1,to;u=0}d=r.gzindex<r.gzhead.comment.length?255&r.gzhead.comment.charCodeAt(r.gzindex++):0,tE(r,d)}while(0!==d)r.gzhead.hcrc&&r.pending>u&&(t.adler=X(t.adler,r.pending_buf,r.pending-u,u));//---//
}r.status=103}if(103===r.status){if(r.gzhead.hcrc){if(r.pending+2>r.pending_buf_size&&(tA(t),0!==r.pending))return r.last_flush=-1,to;tE(r,255&t.adler),tE(r,t.adler>>8&255),t.adler=0}if(r.status=113,/* Compression must start with an empty pending buffer */tA(t),0!==r.pending)return r.last_flush=-1,to}//#endif
/* Start a new block or continue the current one.
   */if(0!==t.avail_in||0!==r.lookahead||e!==tr&&666!==r.status){var c=0===r.level?tO(r,e):r.strategy===t_?tB(r,e):r.strategy===tp?tD(r,e):tL[r.level].func(r,e);if((3===c||4===c)&&(r.status=666),1===c||3===c)return 0===t.avail_out&&(r.last_flush=-1),to;if(2===c&&(e===tn?te(r):e!==ts&&($(r,0,0,!1),e===ti&&(/*** CLEAR_HASH(s); ***//* forget history */tk(r.head),0===r.lookahead&&(r.strstart=0,r.block_start=0,r.insert=0))),tA(t),0===t.avail_out))return r.last_flush=-1,to}return e!==ta?to:r.wrap<=0?tl:(2===r.wrap?(tE(r,255&t.adler),tE(r,t.adler>>8&255),tE(r,t.adler>>16&255),tE(r,t.adler>>24&255),tE(r,255&t.total_in),tE(r,t.total_in>>8&255),tE(r,t.total_in>>16&255),tE(r,t.total_in>>24&255)):(tC(r,t.adler>>>16),tC(r,65535&t.adler)),tA(t),r.wrap>0&&(r.wrap=-r.wrap),0!==r.pending?to:tl)},deflateEnd:function(t){if(tj(t))return th;var e=t.state.status;return t.state=null,113===e?tw(t,tf):to},deflateSetDictionary:function(t,e){var r=e.length;if(tj(t))return th;var n=t.state,i=n.wrap;if(2===i||1===i&&42!==n.status||n.lookahead)return th;/* if dictionary would fill window, just replace the history */if(1===i&&/* adler32(strm->adler, dictionary, dictLength); */(t.adler=K(t.adler,e,r,0)),n.wrap=0,r>=n.w_size){0===i&&(/*** CLEAR_HASH(s); ***/tk(n.head),n.strstart=0,n.block_start=0,n.insert=0);/* use the tail */// dictionary = dictionary.slice(dictLength - s.w_size);
var a=new Uint8Array(n.w_size);a.set(e.subarray(r-n.w_size,r),0),e=a,r=n.w_size}/* insert dictionary into window and hash */var s=t.avail_in,o=t.next_in,l=t.input;for(t.avail_in=r,t.next_in=0,t.input=e,tR(n);n.lookahead>=3;){var h=n.strstart,f=n.lookahead-2;do /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */n.ins_h=tz(n,n.ins_h,n.window[h+3-1]),n.prev[h&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=h,h++;while(--f)n.strstart=h,n.lookahead=2,tR(n)}return n.strstart+=n.lookahead,n.block_start=n.strstart,n.insert=n.lookahead,n.lookahead=0,n.match_length=n.prev_length=2,n.match_available=0,t.next_in=o,t.input=l,t.avail_in=s,n.wrap=i,to},deflateInfo:"pako deflate (from Nodeca project)"},tK={assign:function(t/*from1, from2, from3, ...*/){for(var e=Array.prototype.slice.call(arguments,1);e.length;){var r=e.shift();if(r){if("object"!=typeof r)throw TypeError(r+"must be non-object");for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}}return t},flattenChunks:function(t){for(var e=0,r=0,n=t.length;r<n;r++)e+=t[r].length;for(var i=new Uint8Array(e),a=0,s=0,o=t.length;a<o;a++){var l=t[a];i.set(l,s),s+=l.length}return i}},tY=!0;try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){tY=!1}for(var tX=new Uint8Array(256),tV=0;tV<256;tV++)tX[tV]=tV>=252?6:tV>=248?5:tV>=240?4:tV>=224?3:tV>=192?2:1;tX[254]=tX[254]=1;// Helper
var tJ=function(t,e){// On Chrome, the arguments in a function call that are allowed is `65534`.
// If the length of the buffer is smaller than that, we can use this optimization,
// otherwise we will take a slower path.
if(e<65534&&t.subarray&&tY)return String.fromCharCode.apply(null,t.length===e?t:t.subarray(0,e));for(var r="",n=0;n<e;n++)r+=String.fromCharCode(t[n]);return r},tq={string2buf:function(t){if("function"==typeof TextEncoder&&TextEncoder.prototype.encode)return new TextEncoder().encode(t);var e,r,n,i,a,s=t.length,o=0;// count binary size
for(i=0;i<s;i++)(64512&(r=t.charCodeAt(i)))==55296&&i+1<s&&(64512&(n=t.charCodeAt(i+1)))==56320&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;// convert
for(a=0,// allocate buffer
e=new Uint8Array(o),i=0;a<o;i++)(64512&(r=t.charCodeAt(i)))==55296&&i+1<s&&(64512&(n=t.charCodeAt(i+1)))==56320&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?/* one byte */e[a++]=r:(r<2048?/* two bytes */e[a++]=192|r>>>6:(r<65536?/* three bytes */e[a++]=224|r>>>12:(/* four bytes */e[a++]=240|r>>>18,e[a++]=128|r>>>12&63),e[a++]=128|r>>>6&63),e[a++]=128|63&r);return e},buf2string:function(t,e){var r,n,i=e||t.length;if("function"==typeof TextDecoder&&TextDecoder.prototype.decode)return new TextDecoder().decode(t.subarray(0,e));// Reserve max possible length (2 words per char)
// NB: by unknown reasons, Array is significantly faster for
//     String.fromCharCode.apply than Uint16Array.
var a=Array(2*i);for(n=0,r=0;r<i;){var s=t[r++];// quick process ascii
if(s<128){a[n++]=s;continue}var o=tX[s];// skip 5 & 6 byte codes
if(o>4){a[n++]=65533,r+=o-1;continue}// join the rest
for(// apply mask on first byte
s&=2===o?31:3===o?15:7;o>1&&r<i;)s=s<<6|63&t[r++],o--;// terminated by end of string?
if(o>1){a[n++]=65533;continue}s<65536?a[n++]=s:(s-=65536,a[n++]=55296|s>>10&1023,a[n++]=56320|1023&s)}return tJ(a,n)},utf8border:function(t,e){(e=e||t.length)>t.length&&(e=t.length);for(// go back from last position, until start of sequence found
var r=e-1;r>=0&&(192&t[r])==128;)r--;return(// Very small and broken sequence,
// return max, because we should return something anyway.
r<0||0===r?e:r+tX[t[r]]>e?r:e)}},t$=// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
function(){/* next input byte */this.input=null,this.next_in=0,/* number of bytes available at input */this.avail_in=0,/* total number of input bytes read so far */this.total_in=0,/* next output byte should be put there */this.output=null,this.next_out=0,/* remaining free space at output */this.avail_out=0,/* total number of bytes output so far */this.total_out=0,/* last error message, NULL if no error */this.msg=""/*Z_NULL*/,/* not visible by applications */this.state=null,/* best guess about the data type: binary or text */this.data_type=2/*Z_UNKNOWN*/,/* adler32 value of the uncompressed data */this.adler=0},tQ=Object.prototype.toString,t0=J.Z_NO_FLUSH,t1=J.Z_SYNC_FLUSH,t2=J.Z_FULL_FLUSH,t5=J.Z_FINISH,t6=J.Z_OK,t3=J.Z_STREAM_END,t8=J.Z_DEFAULT_COMPRESSION,t4=J.Z_DEFAULT_STRATEGY,t9=J.Z_DEFLATED;/* ===========================================================================*//**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **//* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **//**
 * Deflate.result -> Uint8Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param).
 **//**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **//**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **//**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 *   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/function t7(t){this.options=tK.assign({level:t8,method:t9,chunkSize:16384,windowBits:15,memLevel:8,strategy:t4},t||{});var e,r=this.options;r.raw&&r.windowBits>0?r.windowBits=-r.windowBits:r.gzip&&r.windowBits>0&&r.windowBits<16&&(r.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new t$,this.strm.avail_out=0;var n=tG.deflateInit2(this.strm,r.level,r.method,r.windowBits,r.memLevel,r.strategy);if(n!==t6)throw Error(V[n]);if(r.header&&tG.deflateSetHeader(this.strm,r.header),r.dictionary){if(e="string"==typeof r.dictionary?tq.string2buf(r.dictionary):"[object ArrayBuffer]"===tQ.call(r.dictionary)?new Uint8Array(r.dictionary):r.dictionary,(n=tG.deflateSetDictionary(this.strm,e))!==t6)throw Error(V[n]);this._dict_set=!0}}/**
 * deflate(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/function et(t,e){var r=new t7(e);// That will never happens, if you don't cheat with options :)
if(r.push(t,!0),r.err)throw r.msg||V[r.err];return r.result}/**
 * Deflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must
 * have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
 * buffers and call [[Deflate#onEnd]].
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/t7.prototype.push=function(t,e){var r,n,i=this.strm,a=this.options.chunkSize;if(this.ended)return!1;for(n=e===~~e?e:!0===e?t5:t0,"string"==typeof t?i.input=tq.string2buf(t):"[object ArrayBuffer]"===tQ.call(t)?i.input=new Uint8Array(t):i.input=t,i.next_in=0,i.avail_in=i.input.length;;){// Make sure avail_out > 6 to avoid repeating markers
if(0===i.avail_out&&(i.output=new Uint8Array(a),i.next_out=0,i.avail_out=a),(n===t1||n===t2)&&i.avail_out<=6){this.onData(i.output.subarray(0,i.next_out)),i.avail_out=0;continue}// Ended => flush and finish
if((r=tG.deflate(i,n))===t3)return i.next_out>0&&this.onData(i.output.subarray(0,i.next_out)),r=tG.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===t6;// Flush if out buffer full
if(0===i.avail_out){this.onData(i.output);continue}// Flush if requested and has data
if(n>0&&i.next_out>0){this.onData(i.output.subarray(0,i.next_out)),i.avail_out=0;continue}if(0===i.avail_in)break}return!0},/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array): output data.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/t7.prototype.onData=function(t){this.chunks.push(t)},/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/t7.prototype.onEnd=function(t){t===t6&&(this.result=tK.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var ee={Deflate:t7,deflate:et,deflateRaw:/**
 * deflateRaw(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/function(t,e){return(e=e||{}).raw=!0,et(t,e)},gzip:/**
 * gzip(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/function(t,e){return(e=e||{}).gzip=!0,et(t,e)}},er=function(t,e){/* copy state to local variables */var r,n,i,a,s,o,l,h,f,d,u,c,_,p,m,g,v,b,w,y,k,x,z,A,S=t.state;//here = state.here;
r=t.next_in,z=t.input,n=r+(t.avail_in-5),i=t.next_out,A=t.output,a=i-(e-t.avail_out),s=i+(t.avail_out-257),//#ifdef INFLATE_STRICT
o=S.dmax,//#endif
l=S.wsize,h=S.whave,f=S.wnext,d=S.window,u=S.hold,c=S.bits,_=S.lencode,p=S.distcode,m=(1<<S.lenbits)-1,g=(1<<S.distbits)-1;/* decode literals and length/distances until end-of-block or not enough
     input data or output space */t:do for(c<15&&(u+=z[r++]<<c,c+=8,u+=z[r++]<<c,c+=8),v=_[u&m];;){if(u>>>=b=v>>>24/*here.bits*/,c-=b,0==(b=v>>>16&255/*here.op*/))//        "inflate:         literal '%c'\n" :
//        "inflate:         literal 0x%02x\n", here.val));
A[i++]=65535/*here.val*/&v;else if(16&b)for(w=65535/*here.val*/&v,(b&=15)&&(c<b&&(u+=z[r++]<<c,c+=8),w+=u&(1<<b)-1,u>>>=b,c-=b),c<15&&(u+=z[r++]<<c,c+=8,u+=z[r++]<<c,c+=8),v=p[u&g];;){if(u>>>=b=v>>>24/*here.bits*/,c-=b,16&(b=v>>>16&255/*here.op*/)){//#ifdef INFLATE_STRICT
if(y=65535/*here.val*/&v,c<(b&=15)&&(u+=z[r++]<<c,(c+=8)<b&&(u+=z[r++]<<c,c+=8)),(y+=u&(1<<b)-1)>o){t.msg="invalid distance too far back",S.mode=16209;break t}if(//#endif
u>>>=b,c-=b,y>//Tracevv((stderr, "inflate:         distance %u\n", dist));
(b=i-a)){if((b=y-b)>h&&S.sane){t.msg="invalid distance too far back",S.mode=16209;break t}if(k=0,x=d,0===f){if(k+=l-b,b<w){w-=b;do A[i++]=d[k++];while(--b)k=i-y,x=A}}else if(f<b){if(k+=l+f-b,(b-=f)<w){w-=b;do A[i++]=d[k++];while(--b)if(k=0,f<w){w-=b=f;do A[i++]=d[k++];while(--b)k=i-y,x=A}}}else if(k+=f-b,b<w){w-=b;do A[i++]=d[k++];while(--b)k=i-y,x=A}for(;w>2;)A[i++]=x[k++],A[i++]=x[k++],A[i++]=x[k++],w-=3;w&&(A[i++]=x[k++],w>1&&(A[i++]=x[k++]))}else{k=i-y;/* copy direct from output */do A[i++]=A[k++],A[i++]=A[k++],A[i++]=A[k++],w-=3;while(w>2)w&&(A[i++]=A[k++],w>1&&(A[i++]=A[k++]))}}else if((64&b)==0){v=p[(65535&v)+(u&(1<<b)-1)];continue}else{t.msg="invalid distance code",S.mode=16209;break t}break;// need to emulate goto via "continue"
}else if((64&b)==0){v=_[(65535&v)+(u&(1<<b)-1)];continue}else if(32&b){//Tracevv((stderr, "inflate:         end of block\n"));
S.mode=16191;break t}else{t.msg="invalid literal/length code",S.mode=16209;break t}break;// need to emulate goto via "continue"
}while(r<n&&i<s)r-=/* return unused bytes (on entry, bits < 8, so in won't go too far back) */w=c>>3,c-=w<<3,u&=(1<<c)-1,/* update state and return */t.next_in=r,t.next_out=i,t.avail_in=r<n?5+(n-r):5-(r-n),t.avail_out=i<s?257+(s-i):257-(i-s),S.hold=u,S.bits=c},en=new Uint16Array([/* Length codes 257..285 base */3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),ei=new Uint8Array([/* Length codes 257..285 extra */16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78]),ea=new Uint16Array([/* Distance codes 0..29 base */1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),es=new Uint8Array([/* Distance codes 0..29 extra */16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64]),eo=function(t,e,r,n,i,a,s,o){var l,h,f,d,u,c,_,p,m,g=o.bits,v=0,b=0,w=0,y=0,k=0,x=0,z=0,A=0,S=0,E=0,C=null,F=new Uint16Array(16),I=new Uint16Array(16),R=null;/*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   *//* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */for(v=0;v<=15;v++)F[v]=0;for(b=0;b<n;b++)F[e[r+b]]++;for(y=15,/* bound code lengths, force root to be within code lengths */k=g;y>=1&&0===F[y];y--);if(k>y&&(k=y),0===y)return(//table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
//table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
//table.val[opts.table_index++] = 0;   //here.val = (var short)0;
i[a++]=20971520,//table.op[opts.table_index] = 64;
//table.bits[opts.table_index] = 1;
//table.val[opts.table_index++] = 0;
i[a++]=20971520,o.bits=1,0);/* no symbols, but wait for decoding to report error */for(w=1;w<y&&0===F[w];w++);for(k<w&&(k=w),/* check for an over-subscribed or incomplete set of lengths */A=1,v=1;v<=15;v++)if(A<<=1,(A-=F[v])<0)return -1;if(A>0&&(0===t||1!==y))return -1;/* incomplete set */for(v=1,/* generate offsets into symbol table for each length for sorting */I[1]=0;v<15;v++)I[v+1]=I[v]+F[v];/* sort symbols by length, by symbol order within each length */for(b=0;b<n;b++)0!==e[r+b]&&(s[I[e[r+b]]++]=b);/* check available table space */if(0===t?(C=R=s,c=20):1===t?(C=en,R=ei,c=257):(C=ea,R=es,c=0),/* initialize opts for loop */E=0,b=0,v=w,u=a,x=k,z=0,f=-1,d=(S=1<<k)-1,1===t&&S>852||2===t&&S>592)return 1;/* process all codes and make table entries */for(;;){/* create table entry */_=v-z,s[b]+1<c?(p=0,m=s[b]):s[b]>=c?(p=R[s[b]-c],m=C[s[b]-c]):(p=96,m=0),/* replicate for those indices with low len bits equal to huff */l=1<<v-z,w=h=1<<x;do i[u+(E>>z)+(h-=l)]=_<<24|p<<16|m|0;while(0!==h)for(/* backwards increment the len-bit code huff */l=1<<v-1;E&l;)l>>=1;if(0!==l?(E&=l-1,E+=l):E=0,/* go to next symbol, update count, len */b++,0==--F[v]){if(v===y)break;v=e[r+s[b]]}/* create new sub-table if needed */if(v>k&&(E&d)!==f){for(0===z&&(z=k),/* increment past last table */u+=w,A=1<</* determine length of next table */(x=v-z);x+z<y&&!((A-=F[x+z])<=0);)x++,A<<=1;if(/* check for enough space */S+=1<<x,1===t&&S>852||2===t&&S>592)return 1;/*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/i[/* point entry in root table to sub-table */f=E&d]=k<<24|x<<16|u-a|0}}return 0!==E&&//table.bits[next + huff] = len - drop;
//table.val[next + huff] = 0;
(i[u+E]=v-z<<24|4194304),/* set return parameters *///opts.table_index += used;
o.bits=k,0},el=J.Z_FINISH,eh=J.Z_BLOCK,ef=J.Z_TREES,ed=J.Z_OK,eu=J.Z_STREAM_END,ec=J.Z_NEED_DICT,e_=J.Z_STREAM_ERROR,ep=J.Z_DATA_ERROR,em=J.Z_MEM_ERROR,eg=J.Z_BUF_ERROR,ev=J.Z_DEFLATED,eb=function(t){return(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24)};function ew(){this.strm=null,this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,// TODO: may be {}
this.head=null,/* sliding window */this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,/* bit accumulator */this.hold=0,this.bits=0,/* for string and stored block copying */this.length=0,this.offset=0,/* for table and code decoding */this.extra=0,/* fixed and dynamic code tables */this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,/* dynamic table building */this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Uint16Array(320),this.work=new Uint16Array(288),/*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  *///this.codes = new Int32Array(ENOUGH);       /* space for code tables */
this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}var ey=function(t){if(!t)return 1;var e=t.state;return!e||e.strm!==t||e.mode<16180||e.mode>16211?1:0},ek=function(t){if(ey(t))return e_;var e=t.state;//Tracev((stderr, "inflate: reset\n"));
return t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=16180,e.last=0,e.havedict=0,e.flags=-1,e.dmax=32768,e.head=null/*Z_NULL*/,e.hold=0,e.bits=0,//state.lencode = state.distcode = state.next = state.codes;
e.lencode=e.lendyn=new Int32Array(852),e.distcode=e.distdyn=new Int32Array(592),e.sane=1,e.back=-1,ed},ex=function(t){if(ey(t))return e_;var e=t.state;return e.wsize=0,e.whave=0,e.wnext=0,ek(t)},ez=function(t,e){/* get the state */if(ey(t))return e_;var r,n=t.state;return/* set number of window bits, free window if different */(e<0?(r=0,e=-e):(r=(e>>4)+5,e<48&&(e&=15)),e&&(e<8||e>15))?e_:(null!==n.window&&n.wbits!==e&&(n.window=null),/* update state and reset the rest of it */n.wrap=r,n.wbits=e,ex(t))},eA=function(t,e){if(!t)return e_;//strm.msg = Z_NULL;                 /* in case we return an error */
var r=new ew;//if (state === Z_NULL) return Z_MEM_ERROR;
//Tracev((stderr, "inflate: allocated\n"));
t.state=r,r.strm=t,r.window=null/*Z_NULL*/,r.mode=16180;var n=ez(t,e);return n!==ed&&(t.state=null/*Z_NULL*/),n},eS=!0,eE=function(t){/* build fixed huffman tables if first call (may not be thread safe) */if(eS){s=new Int32Array(512),o=new Int32Array(32);for(/* literal/length table */var e=0;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(eo(1,t.lens,0,288,s,0,t.work,{bits:9}),/* distance table */e=0;e<32;)t.lens[e++]=5;eo(2,t.lens,0,32,o,0,t.work,{bits:5}),/* do this just once */eS=!1}t.lencode=s,t.lenbits=9,t.distcode=o,t.distbits=5},eC=function(t,e,r,n){var i,a=t.state;return null===a.window&&(a.wsize=1<<a.wbits,a.wnext=0,a.whave=0,a.window=new Uint8Array(a.wsize)),n>=a.wsize?(a.window.set(e.subarray(r-a.wsize,r),0),a.wnext=0,a.whave=a.wsize):((i=a.wsize-a.wnext)>n&&(i=n),//zmemcpy(state->window + state->wnext, end - copy, dist);
a.window.set(e.subarray(r-n,r-n+i),a.wnext),(n-=i)?(//zmemcpy(state->window, end - copy, copy);
a.window.set(e.subarray(r-n,r),0),a.wnext=n,a.whave=a.wsize):(a.wnext+=i,a.wnext===a.wsize&&(a.wnext=0),a.whave<a.wsize&&(a.whave+=i))),0},eF={inflateReset:ex,inflateReset2:ez,inflateResetKeep:ek,inflateInit:function(t){return eA(t,15)},inflateInit2:eA,inflate:function(t,e){var r,n,i,a,s,o,l,h,f,d,u,c,_,p,m,g,v,b,w,y,k,x,z,A,S=0,E=new Uint8Array(4),C=/* permutation of code lengths */new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);/* current decoding table entry */if(ey(t)||!t.output||!t.input&&0!==t.avail_in)return e_;16191===(r=t.state).mode&&(r.mode=16192),/* skip check *///--- LOAD() ---
s=t.next_out,i=t.output,l=t.avail_out,a=t.next_in,n=t.input,o=t.avail_in,h=r.hold,f=r.bits,//---
d=o,u=l,x=ed;e:for(;;)switch(r.mode){case 16180:if(0===r.wrap){r.mode=16192;break}//=== NEEDBITS(16);
for(;f<16;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//===//
if(2&r.wrap&&35615===h){0===r.wbits&&(r.wbits=15),r.check=0/*crc32(0L, Z_NULL, 0)*/,//=== CRC2(state.check, hold);
E[0]=255&h,E[1]=h>>>8&255,r.check=X(r.check,E,2,0),//===//
//=== INITBITS();
h=0,f=0,//===//
r.mode=16181;break}if(r.head&&(r.head.done=!1),!(1&r.wrap)||/* check if zlib header allowed */(((255&h)<<8)+(h>>8))%31){t.msg="incorrect header check",r.mode=16209;break}if((15&h)!==ev){t.msg="unknown compression method",r.mode=16209;break}if(//--- DROPBITS(4) ---//
h>>>=4,f-=4,//---//
k=(15&h)+8,0===r.wbits&&(r.wbits=k),k>15||k>r.wbits){t.msg="invalid window size",r.mode=16209;break}// !!! pako patch. Force use `options.windowBits` if passed.
// Required to always use max window size by default.
r.dmax=1<<r.wbits,//state.dmax = 1 << len;
r.flags=0,//Tracev((stderr, "inflate:   zlib header ok\n"));
t.adler=r.check=1/*adler32(0L, Z_NULL, 0)*/,r.mode=512&h?16189:16191,//=== INITBITS();
h=0,f=0;break;case 16181://=== NEEDBITS(16); */
for(;f<16;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}if(//===//
r.flags=h,(255&r.flags)!==ev){t.msg="unknown compression method",r.mode=16209;break}if(57344&r.flags){t.msg="unknown header flags set",r.mode=16209;break}r.head&&(r.head.text=h>>8&1),512&r.flags&&4&r.wrap&&(//=== CRC2(state.check, hold);
E[0]=255&h,E[1]=h>>>8&255,r.check=X(r.check,E,2,0)),//=== INITBITS();
h=0,f=0,//===//
r.mode=16182;/* falls through */case 16182://=== NEEDBITS(32); */
for(;f<32;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}r.head&&(r.head.time=h),512&r.flags&&4&r.wrap&&(//=== CRC4(state.check, hold)
E[0]=255&h,E[1]=h>>>8&255,E[2]=h>>>16&255,E[3]=h>>>24&255,r.check=X(r.check,E,4,0)),//=== INITBITS();
h=0,f=0,//===//
r.mode=16183;/* falls through */case 16183://=== NEEDBITS(16); */
for(;f<16;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}r.head&&(r.head.xflags=255&h,r.head.os=h>>8),512&r.flags&&4&r.wrap&&(//=== CRC2(state.check, hold);
E[0]=255&h,E[1]=h>>>8&255,r.check=X(r.check,E,2,0)),//=== INITBITS();
h=0,f=0,//===//
r.mode=16184;/* falls through */case 16184:if(1024&r.flags){//=== NEEDBITS(16); */
for(;f<16;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//===//
r.length=h,r.head&&(r.head.extra_len=h),512&r.flags&&4&r.wrap&&(//=== CRC2(state.check, hold);
E[0]=255&h,E[1]=h>>>8&255,r.check=X(r.check,E,2,0)),//=== INITBITS();
h=0,f=0;//===//
}else r.head&&(r.head.extra=null/*Z_NULL*/);r.mode=16185;/* falls through */case 16185:if(1024&r.flags&&((c=r.length)>o&&(c=o),c&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Uint8Array(r.head.extra_len)),r.head.extra.set(n.subarray(a,// - no need for additional size check
a+c),/*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/k)),512&r.flags&&4&r.wrap&&(r.check=X(r.check,n,c,a)),o-=c,a+=c,r.length-=c),r.length))break e;r.length=0,r.mode=16186;/* falls through */case 16186:if(2048&r.flags){if(0===o)break e;c=0;do // TODO: 2 or 1 bytes?
k=n[a+c++],r.head&&k&&r.length<65536/*state.head.name_max*/&&(r.head.name+=String.fromCharCode(k));while(k&&c<o)if(512&r.flags&&4&r.wrap&&(r.check=X(r.check,n,c,a)),o-=c,a+=c,k)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=16187;/* falls through */case 16187:if(4096&r.flags){if(0===o)break e;c=0;do k=n[a+c++],r.head&&k&&r.length<65536/*state.head.comm_max*/&&(r.head.comment+=String.fromCharCode(k));while(k&&c<o)if(512&r.flags&&4&r.wrap&&(r.check=X(r.check,n,c,a)),o-=c,a+=c,k)break e}else r.head&&(r.head.comment=null);r.mode=16188;/* falls through */case 16188:if(512&r.flags){//=== NEEDBITS(16); */
for(;f<16;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//===//
if(4&r.wrap&&h!==(65535&r.check)){t.msg="header crc mismatch",r.mode=16209;break}//=== INITBITS();
h=0,f=0;//===//
}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),t.adler=r.check=0,r.mode=16191;break;case 16189://=== NEEDBITS(32); */
for(;f<32;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//===//
t.adler=r.check=eb(h),//=== INITBITS();
h=0,f=0,//===//
r.mode=16190;/* falls through */case 16190:if(0===r.havedict)//---
return(//--- RESTORE() ---
t.next_out=s,t.avail_out=l,t.next_in=a,t.avail_in=o,r.hold=h,r.bits=f,ec);t.adler=r.check=1/*adler32(0L, Z_NULL, 0)*/,r.mode=16191;/* falls through */case 16191:if(e===eh||e===ef)break e;/* falls through */case 16192:if(r.last){//--- BYTEBITS() ---//
h>>>=7&f,f-=7&f,//---//
r.mode=16206;break}//=== NEEDBITS(3); */
for(;f<3;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//---//
switch(//===//
r.last=1/*BITS(1)*/&h,f-=1,3&//--- DROPBITS(1) ---//
(h>>>=1)){case 0:/* stored block *///Tracev((stderr, "inflate:     stored block%s\n",
//        state.last ? " (last)" : ""));
r.mode=16193;break;case 1:if(/* fixed block */eE(r),//Tracev((stderr, "inflate:     fixed codes block%s\n",
//        state.last ? " (last)" : ""));
r.mode=16199,e===ef){//--- DROPBITS(2) ---//
h>>>=2,f-=2;break e}break;case 2:/* dynamic block *///Tracev((stderr, "inflate:     dynamic codes block%s\n",
//        state.last ? " (last)" : ""));
r.mode=16196;break;case 3:t.msg="invalid block type",r.mode=16209}//--- DROPBITS(2) ---//
h>>>=2,f-=2;break;case 16193://---//
//=== NEEDBITS(32); */
for(//--- BYTEBITS() ---// /* go to byte boundary */
h>>>=7&f,f-=7&f;f<32;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//===//
if((65535&h)!=(h>>>16^65535)){t.msg="invalid stored block lengths",r.mode=16209;break}if(r.length=65535&h,//Tracev((stderr, "inflate:       stored length %u\n",
//        state.length));
//=== INITBITS();
h=0,f=0,//===//
r.mode=16194,e===ef)break e;/* falls through */case 16194:r.mode=16195;/* falls through */case 16195:if(c=r.length){if(c>o&&(c=o),c>l&&(c=l),0===c)break e;//--- zmemcpy(put, next, copy); ---
i.set(n.subarray(a,a+c),s),//---//
o-=c,a+=c,l-=c,s+=c,r.length-=c;break}//Tracev((stderr, "inflate:       stored end\n"));
r.mode=16191;break;case 16196://=== NEEDBITS(14); */
for(;f<14;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//---//
//#ifndef PKZIP_BUG_WORKAROUND
if(//===//
r.nlen=(31&h)+257,//--- DROPBITS(5) ---//
h>>>=5,f-=5,//---//
r.ndist=(31&h)+1,//--- DROPBITS(5) ---//
h>>>=5,f-=5,//---//
r.ncode=(15&h)+4,//--- DROPBITS(4) ---//
h>>>=4,f-=4,r.nlen>286||r.ndist>30){t.msg="too many length or distance symbols",r.mode=16209;break}//#endif
//Tracev((stderr, "inflate:       table sizes ok\n"));
r.have=0,r.mode=16197;/* falls through */case 16197:for(;r.have<r.ncode;){//=== NEEDBITS(3);
for(;f<3;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//===//
r.lens[C[r.have++]]=7&h,//--- DROPBITS(3) ---//
h>>>=3,f-=3;//---//
}for(;r.have<19;)r.lens[C[r.have++]]=0;if(// We have separate tables & no pointers. 2 commented lines below not needed.
//state.next = state.codes;
//state.lencode = state.next;
// Switch to use dynamic table
r.lencode=r.lendyn,r.lenbits=7,z={bits:r.lenbits},x=eo(0,r.lens,0,19,r.lencode,0,r.work,z),r.lenbits=z.bits,x){t.msg="invalid code lengths set",r.mode=16209;break}//Tracev((stderr, "inflate:       code lengths ok\n"));
r.have=0,r.mode=16198;/* falls through */case 16198:for(;r.have<r.nlen+r.ndist;){for(;m=(S=r.lencode[h&(1<<r.lenbits)-1])>>>24,g=S>>>16&255,v=65535&S,!(m<=f);){//--- PULLBYTE() ---//
if(0===o)break e;o--,h+=n[a++]<<f,f+=8;//---//
}if(v<16)//--- DROPBITS(here.bits) ---//
h>>>=m,f-=m,//---//
r.lens[r.have++]=v;else{if(16===v){for(//=== NEEDBITS(here.bits + 2);
A=m+2;f<A;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//---//
if(//===//
//--- DROPBITS(here.bits) ---//
h>>>=m,f-=m,0===r.have){t.msg="invalid bit length repeat",r.mode=16209;break}k=r.lens[r.have-1],c=3+(3&h),//--- DROPBITS(2) ---//
h>>>=2,f-=2;//---//
}else if(17===v){for(//=== NEEDBITS(here.bits + 3);
A=m+3;f<A;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//===//
//--- DROPBITS(here.bits) ---//
h>>>=m,f-=m,//---//
k=0,c=3+(7&h),//--- DROPBITS(3) ---//
h>>>=3,f-=3;//---//
}else{for(//=== NEEDBITS(here.bits + 7);
A=m+7;f<A;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//===//
//--- DROPBITS(here.bits) ---//
h>>>=m,f-=m,//---//
k=0,c=11+(127&h),//--- DROPBITS(7) ---//
h>>>=7,f-=7;//---//
}if(r.have+c>r.nlen+r.ndist){t.msg="invalid bit length repeat",r.mode=16209;break}for(;c--;)r.lens[r.have++]=k}}/* handle error breaks in while */if(16209===r.mode)break;/* check for end-of-block code (better have one) */if(0===r.lens[256]){t.msg="invalid code -- missing end-of-block",r.mode=16209;break}// state.lencode = state.next;
if(/* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */r.lenbits=9,z={bits:r.lenbits},x=eo(1,r.lens,0,r.nlen,r.lencode,0,r.work,z),// We have separate tables & no pointers. 2 commented lines below not needed.
// state.next_index = opts.table_index;
r.lenbits=z.bits,x){t.msg="invalid literal/lengths set",r.mode=16209;break}// state.distcode = state.next;
if(r.distbits=6,//state.distcode.copy(state.codes);
// Switch to use dynamic table
r.distcode=r.distdyn,z={bits:r.distbits},x=eo(2,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,z),// We have separate tables & no pointers. 2 commented lines below not needed.
// state.next_index = opts.table_index;
r.distbits=z.bits,x){t.msg="invalid distances set",r.mode=16209;break}if(//Tracev((stderr, 'inflate:       codes ok\n'));
r.mode=16199,e===ef)break e;/* falls through */case 16199:r.mode=16200;/* falls through */case 16200:if(o>=6&&l>=258){//--- RESTORE() ---
t.next_out=s,t.avail_out=l,t.next_in=a,t.avail_in=o,r.hold=h,r.bits=f,//---
er(t,u),//--- LOAD() ---
s=t.next_out,i=t.output,l=t.avail_out,a=t.next_in,n=t.input,o=t.avail_in,h=r.hold,f=r.bits,16191===r.mode&&(r.back=-1);break}for(r.back=0;m=(S=r.lencode[h&(1<<r.lenbits)-1])>>>24,g=S>>>16&255,v=65535&S,!(m<=f);){//--- PULLBYTE() ---//
if(0===o)break e;o--,h+=n[a++]<<f,f+=8;//---//
}if(g&&(240&g)==0){for(b=m,w=g,y=v;m=(S=r.lencode[y+((h&(1<<b+w)-1)>>b)])>>>24,g=S>>>16&255,v=65535&S,!(b+m<=f);){//--- PULLBYTE() ---//
if(0===o)break e;o--,h+=n[a++]<<f,f+=8;//---//
}//--- DROPBITS(last.bits) ---//
h>>>=b,f-=b,//---//
r.back+=b}if(//--- DROPBITS(here.bits) ---//
h>>>=m,f-=m,//---//
r.back+=m,r.length=v,0===g){//Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
//        "inflate:         literal '%c'\n" :
//        "inflate:         literal 0x%02x\n", here.val));
r.mode=16205;break}if(32&g){//Tracevv((stderr, "inflate:         end of block\n"));
r.back=-1,r.mode=16191;break}if(64&g){t.msg="invalid literal/length code",r.mode=16209;break}r.extra=15&g,r.mode=16201;/* falls through */case 16201:if(r.extra){for(//=== NEEDBITS(state.extra);
A=r.extra;f<A;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//===//
r.length+=h&(1<<r.extra)-1/*BITS(state.extra)*/,//--- DROPBITS(state.extra) ---//
h>>>=r.extra,f-=r.extra,//---//
r.back+=r.extra}//Tracevv((stderr, "inflate:         length %u\n", state.length));
r.was=r.length,r.mode=16202;/* falls through */case 16202:for(;m=(S=r.distcode[h&(1<<r.distbits)-1])>>>24,g=S>>>16&255,v=65535&S,!(m<=f);){//--- PULLBYTE() ---//
if(0===o)break e;o--,h+=n[a++]<<f,f+=8;//---//
}if((240&g)==0){for(b=m,w=g,y=v;m=(S=r.distcode[y+((h&(1<<b+w)-1)>>b)])>>>24,g=S>>>16&255,v=65535&S,!(b+m<=f);){//--- PULLBYTE() ---//
if(0===o)break e;o--,h+=n[a++]<<f,f+=8;//---//
}//--- DROPBITS(last.bits) ---//
h>>>=b,f-=b,//---//
r.back+=b}if(//--- DROPBITS(here.bits) ---//
h>>>=m,f-=m,//---//
r.back+=m,64&g){t.msg="invalid distance code",r.mode=16209;break}r.offset=v,r.extra=15&g,r.mode=16203;/* falls through */case 16203:if(r.extra){for(//=== NEEDBITS(state.extra);
A=r.extra;f<A;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//===//
r.offset+=h&(1<<r.extra)-1/*BITS(state.extra)*/,//--- DROPBITS(state.extra) ---//
h>>>=r.extra,f-=r.extra,//---//
r.back+=r.extra}//#ifdef INFLATE_STRICT
if(r.offset>r.dmax){t.msg="invalid distance too far back",r.mode=16209;break}//#endif
//Tracevv((stderr, "inflate:         distance %u\n", state.offset));
r.mode=16204;/* falls through */case 16204:if(0===l)break e;if(c=u-l,r.offset>c){if((c=r.offset-c)>r.whave&&r.sane){t.msg="invalid distance too far back",r.mode=16209;break}c>r.wnext?(c-=r.wnext,_=r.wsize-c):_=r.wnext-c,c>r.length&&(c=r.length),p=r.window}else p=i,_=s-r.offset,c=r.length;c>l&&(c=l),l-=c,r.length-=c;do i[s++]=p[_++];while(--c)0===r.length&&(r.mode=16200);break;case 16205:if(0===l)break e;i[s++]=r.length,l--,r.mode=16200;break;case 16206:if(r.wrap){//=== NEEDBITS(32);
for(;f<32;){if(0===o)break e;o--,// Use '|' instead of '+' to make sure that result is signed
h|=n[a++]<<f,f+=8}// NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
if(//===//
u-=l,t.total_out+=u,r.total+=u,4&r.wrap&&u&&(t.adler=r.check=/*UPDATE_CHECK(state.check, put - _out, _out);*/r.flags?X(r.check,i,u,s-u):K(r.check,i,u,s-u)),u=l,4&r.wrap&&(r.flags?h:eb(h))!==r.check){t.msg="incorrect data check",r.mode=16209;break}//=== INITBITS();
h=0,f=0;//===//
//Tracev((stderr, "inflate:   check matches trailer\n"));
}r.mode=16207;/* falls through */case 16207:if(r.wrap&&r.flags){//=== NEEDBITS(32);
for(;f<32;){if(0===o)break e;o--,h+=n[a++]<<f,f+=8}//===//
if(4&r.wrap&&h!==(4294967295&r.total)){t.msg="incorrect length check",r.mode=16209;break}//=== INITBITS();
h=0,f=0;//===//
//Tracev((stderr, "inflate:   length matches trailer\n"));
}r.mode=16208;/* falls through */case 16208:x=eu;break e;case 16209:x=ep;break e;case 16210:return em;default:return e_}return(// inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"
/*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   *///--- RESTORE() ---
t.next_out=s,t.avail_out=l,t.next_in=a,t.avail_in=o,r.hold=h,r.bits=f,(r.wsize||u!==t.avail_out&&r.mode<16209&&(r.mode<16206||e!==el))&&eC(t,t.output,t.next_out,u-t.avail_out),d-=t.avail_in,u-=t.avail_out,t.total_in+=d,t.total_out+=u,r.total+=u,4&r.wrap&&u&&(t.adler=r.check=/*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/r.flags?X(r.check,i,u,t.next_out-u):K(r.check,i,u,t.next_out-u)),t.data_type=r.bits+(r.last?64:0)+(16191===r.mode?128:0)+(16199===r.mode||16194===r.mode?256:0),(0===d&&0===u||e===el)&&x===ed&&(x=eg),x)},inflateEnd:function(t){if(ey(t))return e_;var e=t.state;return e.window&&(e.window=null),t.state=null,ed},inflateGetHeader:function(t,e){/* check state */if(ey(t))return e_;var r=t.state;return(2&r.wrap)==0?e_:(/* save header structure */r.head=e,e.done=!1,ed)},inflateSetDictionary:function(t,e){var r,n=e.length;return /* check state */ey(t)||0!==(r=t.state).wrap&&16190!==r.mode?e_:16190===r.mode&&K(1,e,n,0)!==r.check?ep:eC(t,e,n,n)?(r.mode=16210,em):(r.havedict=1,ed)},inflateInfo:"pako inflate (from Nodeca project)"},eI=// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
function(){/* true if compressed data believed to be text */this.text=0,/* modification time */this.time=0,/* extra flags (not used when writing a gzip file) */this.xflags=0,/* operating system */this.os=0,/* pointer to extra field or Z_NULL if none */this.extra=null,/* extra field length (valid if extra != Z_NULL) */this.extra_len=0,// but leave for few code modifications
//
// Setup limits is not necessary because in js we should not preallocate memory
// for inflate use constant limit in 65536 bytes
//
/* space at extra (only when reading header) */// this.extra_max  = 0;
/* pointer to zero-terminated file name or Z_NULL */this.name="",/* space at name (only when reading header) */// this.name_max   = 0;
/* pointer to zero-terminated comment or Z_NULL */this.comment="",/* space at comment (only when reading header) */// this.comm_max   = 0;
/* true if there was or will be a header crc */this.hcrc=0,/* true when done reading gzip header (not used when writing a gzip file) */this.done=!1},eR=Object.prototype.toString,eO=J.Z_NO_FLUSH,eU=J.Z_FINISH,eT=J.Z_OK,eD=J.Z_STREAM_END,eB=J.Z_NEED_DICT,eN=J.Z_STREAM_ERROR,eL=J.Z_DATA_ERROR,eZ=J.Z_MEM_ERROR;/* ===========================================================================*//**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **//* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overridden.
 **//**
 * Inflate.result -> Uint8Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param).
 **//**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **//**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **//**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 * const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/function eP(t){this.options=tK.assign({chunkSize:65536,windowBits:15,to:""},t||{});var e=this.options;e.raw&&e.windowBits>=0&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),e.windowBits>=0&&e.windowBits<16&&!(t&&t.windowBits)&&(e.windowBits+=32),e.windowBits>15&&e.windowBits<48&&(15&e.windowBits)==0&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new t$,this.strm.avail_out=0;var r=eF.inflateInit2(this.strm,e.windowBits);if(r!==eT||(this.header=new eI,eF.inflateGetHeader(this.strm,this.header),e.dictionary&&("string"==typeof e.dictionary?e.dictionary=tq.string2buf(e.dictionary):"[object ArrayBuffer]"===eR.call(e.dictionary)&&(e.dictionary=new Uint8Array(e.dictionary)),e.raw&&(r=eF.inflateSetDictionary(this.strm,e.dictionary))!==eT)))throw Error(V[r])}/**
 * inflate(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako');
 * const input = pako.deflate(new Uint8Array([1,2,3,4,5,6,7,8,9]));
 * let output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err) {
 *   console.log(err);
 * }
 * ```
 **/function ej(t,e){var r=new eP(e);// That will never happens, if you don't cheat with options :)
if(r.push(t),r.err)throw r.msg||V[r.err];return r.result}/**
 * Inflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer): input data
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE
 *   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,
 *   `true` means Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. If end of stream detected,
 * [[Inflate#onEnd]] will be called.
 *
 * `flush_mode` is not needed for normal operation, because end of stream
 * detected automatically. You may try to use it for advanced things, but
 * this functionality was not tested.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/eP.prototype.push=function(t,e){var r,n,i,a=this.strm,s=this.options.chunkSize,o=this.options.dictionary;if(this.ended)return!1;for(n=e===~~e?e:!0===e?eU:eO,"[object ArrayBuffer]"===eR.call(t)?a.input=new Uint8Array(t):a.input=t,a.next_in=0,a.avail_in=a.input.length;;){// Skip snyc markers if more data follows and not raw mode
for(0===a.avail_out&&(a.output=new Uint8Array(s),a.next_out=0,a.avail_out=s),(r=eF.inflate(a,n))===eB&&o&&((r=eF.inflateSetDictionary(a,o))===eT?r=eF.inflate(a,n):r===eL&&(r=eB));a.avail_in>0&&r===eD&&a.state.wrap>0&&0!==t[a.next_in];)eF.inflateReset(a),r=eF.inflate(a,n);switch(r){case eN:case eL:case eB:case eZ:return this.onEnd(r),this.ended=!0,!1}if(// Remember real `avail_out` value, because we may patch out buffer content
// to align utf8 strings boundaries.
i=a.avail_out,a.next_out&&(0===a.avail_out||r===eD)){if("string"===this.options.to){var l=tq.utf8border(a.output,a.next_out),h=a.next_out-l,f=tq.buf2string(a.output,l);// move tail & realign counters
a.next_out=h,a.avail_out=s-h,h&&a.output.set(a.output.subarray(l,l+h),0),this.onData(f)}else this.onData(a.output.length===a.next_out?a.output:a.output.subarray(0,a.next_out))}// Must repeat iteration if out buffer is full
if(r!==eT||0!==i){// Finalize if end of stream reached.
if(r===eD)return r=eF.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,!0;if(0===a.avail_in)break}}return!0},/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|String): output data. When string output requested,
 *   each chunk will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/eP.prototype.onData=function(t){this.chunks.push(t)},/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/eP.prototype.onEnd=function(t){t===eT&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=tK.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var eM={Inflate:eP,inflate:ej,inflateRaw:/**
 * inflateRaw(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/function(t,e){return(e=e||{}).raw=!0,ej(t,e)},ungzip:ej},eW=ee.Deflate,eH=(ee.deflate,ee.deflateRaw,ee.gzip,eM.Inflate),eG=(eM.inflate,eM.inflateRaw,eM.ungzip,{Deflate:eW,Inflate:eH}),eK={},eY={};eK=eY,eY.parse=function(t,e){for(var r=eY.bin.readUshort,n=eY.bin.readUint,i=0,a={},s=new Uint8Array(t),o=s.length-4;101010256!=n(s,o);)o--;var i=o,l=r(s,i+=8);r(s,i+=2);var h=n(s,i+=2),f=n(s,i+=4);i+=4,i=f;for(var d=0;d<l;d++){n(s,i),n(s,i+=16);var h=n(s,i+=4),u=n(s,i+=4),c=r(s,i+=4),_=r(s,i+2),p=r(s,i+4),m=n(s,i+=14);i+=4+(c+_+p),eY._readLocal(s,m,a,h,u,e)}//console.log(out);
return a},eY._readLocal=function(t,e,r,n,i,a){var s=eY.bin.readUshort,o=eY.bin.readUint;o(t,e),s(t,e+=4),s(t,e+=2);//if((gpflg&8)!=0) throw "unknown sizes";
var l=s(t,e+=2);o(t,e+=2),o(t,e+=4);var h=s(t,//var csize = rUi(data, o);  o+=4;
//var usize = rUi(data, o);  o+=4;
e+=12),f=s(t,e+=2);e+=2;var d=eY.bin.readUTF8(t,e,h);//console.log(sign.toString(16), ver, gpflg, cmpr, crc32.toString(16), "csize, usize", csize, usize, nlen, elen, name, o);
if(e+=h+f,a){r[d]={size:i,csize:n};return}var u=new Uint8Array(t.buffer,e);if(0==l)r[d]=new Uint8Array(u.buffer.slice(e,e+n));else if(8==l){var c=new Uint8Array(i);eY.inflateRaw(u,c),/*var nbuf = pako["inflateRaw"](file);
		if(usize>8514000) {
			//console.log(PUtils.readASCII(buf , 8514500, 500));
			//console.log(PUtils.readASCII(nbuf, 8514500, 500));
		}
		for(var i=0; i<buf.length; i++) if(buf[i]!=nbuf[i]) {  console.log(buf.length, nbuf.length, usize, i);  throw "e";  }
		*/r[d]=c}else throw"unknown compression method: "+l},eY.inflateRaw=function(t,e){return eY.F.inflate(t,e)},eY.inflate=function(t,e){//console.log(CM, CINFO,CMF,FLG);
return t[0],t[1],eY.inflateRaw(new Uint8Array(t.buffer,t.byteOffset+2,t.length-6),e)},eY.deflate=function(t,e/*, buf, off*/){null==e&&(e={level:6});var r=0,n=new Uint8Array(50+Math.floor(1.1*t.length));n[r]=120,n[r+1]=156,r+=2,r=eY.F.deflateRaw(t,n,r,e.level);var i=eY.adler(t,0,t.length);return n[r+0]=i>>>24&255,n[r+1]=i>>>16&255,n[r+2]=i>>>8&255,n[r+3]=i>>>0&255,new Uint8Array(n.buffer,0,r+4)},eY.deflateRaw=function(t,e){null==e&&(e={level:6});var r=new Uint8Array(50+Math.floor(1.1*t.length)),n=eY.F.deflateRaw(t,r,n,e.level);return new Uint8Array(r.buffer,0,n)},eY.encode=function(t,e){null==e&&(e=!1);var r=0,n=eY.bin.writeUint,i=eY.bin.writeUshort,a={};for(var s in t){var o=!eY._noNeed(s)&&!e,l=t[s],h=eY.crc.crc(l,0,l.length);a[s]={cpr:o,usize:l.length,crc:h,file:o?eY.deflateRaw(l):l}}for(var s in a)r+=a[s].file.length+30+46+2*eY.bin.sizeUTF8(s);r+=22;var f=new Uint8Array(r),d=0,u=[];for(var s in a){var c=a[s];u.push(d),d=eY._writeHeader(f,d,s,c,0)}var _=0,p=d;for(var s in a){var c=a[s];u.push(d),d=eY._writeHeader(f,d,s,c,1,u[_++])}var m=d-p;return n(f,d,101010256),i(f,d+=8,_),i(f,d+=2,_),n(f,d+=2,m),n(f,d+=4,p),d+=6,f.buffer},// no need to compress .PNG, .ZIP, .JPEG ....
eY._noNeed=function(t){var e=t.split(".").pop().toLowerCase();return -1!="png,jpg,jpeg,zip".indexOf(e)},eY._writeHeader=function(t,e,r,n,i,a){var s=eY.bin.writeUint,o=eY.bin.writeUshort,l=n.file;s(t,e,0==i?67324752:33639248),e+=4,1==i&&(e+=2),o(t,e,20),o(t,e+=2,0),o(t,e+=2,n.cpr?8:0),s(t,e+=2,0),s(t,e+=4,n.crc),s(t,e+=4,l.length),s(t,e+=4,n.usize),o(t,e+=4,eY.bin.sizeUTF8(r)),o(t,e+=2,0),e+=2,1==i&&(s(t,e+=10,a),e+=4);var h=eY.bin.writeUTF8(t,e,r);return e+=h,0==i&&(t.set(l,e),e+=l.length),e},eY.crc={table:function(){for(var t=new Uint32Array(256),e=0;e<256;e++){for(var r=e,n=0;n<8;n++)1&r?r=3988292384^r>>>1:r>>>=1;t[e]=r}return t}(),update:function(t,e,r,n){for(var i=0;i<n;i++)t=eY.crc.table[(t^e[r+i])&255]^t>>>8;return t},crc:function(t,e,r){return 4294967295^eY.crc.update(4294967295,t,e,r)}},eY.adler=function(t,e,r){for(var n=1,i=0,a=e,s=e+r;a<s;){for(var o=Math.min(a+5552,s);a<o;)n+=t[a++],i+=n;n%=65521,i%=65521}return i<<16|n},eY.bin={readUshort:function(t,e){return t[e]|t[e+1]<<8},writeUshort:function(t,e,r){t[e]=255&r,t[e+1]=r>>8&255},readUint:function(t,e){return 16777216*t[e+3]+(t[e+2]<<16|t[e+1]<<8|t[e])},writeUint:function(t,e,r){t[e]=255&r,t[e+1]=r>>8&255,t[e+2]=r>>16&255,t[e+3]=r>>24&255},readASCII:function(t,e,r){for(var n="",i=0;i<r;i++)n+=String.fromCharCode(t[e+i]);return n},writeASCII:function(t,e,r){for(var n=0;n<r.length;n++)t[e+n]=r.charCodeAt(n)},pad:function(t){return t.length<2?"0"+t:t},readUTF8:function(t,e,r){for(var n,i="",a=0;a<r;a++)i+="%"+eY.bin.pad(t[e+a].toString(16));try{n=decodeURIComponent(i)}catch(n){return eY.bin.readASCII(t,e,r)}return n},writeUTF8:function(t,e,r){for(var n=r.length,i=0,a=0;a<n;a++){var s=r.charCodeAt(a);if((4294967168&s)==0)t[e+i]=s,i++;else if((4294965248&s)==0)t[e+i]=192|s>>6,t[e+i+1]=128|s>>0&63,i+=2;else if((4294901760&s)==0)t[e+i]=224|s>>12,t[e+i+1]=128|s>>6&63,t[e+i+2]=128|s>>0&63,i+=3;else if((4292870144&s)==0)t[e+i]=240|s>>18,t[e+i+1]=128|s>>12&63,t[e+i+2]=128|s>>6&63,t[e+i+3]=128|s>>0&63,i+=4;else throw"e"}return i},sizeUTF8:function(t){for(var e=t.length,r=0,n=0;n<e;n++){var i=t.charCodeAt(n);if((4294967168&i)==0)r++;else if((4294965248&i)==0)r+=2;else if((4294901760&i)==0)r+=3;else if((4292870144&i)==0)r+=4;else throw"e"}return r}},eY.F={},eY.F.deflateRaw=function(t,e,r,n){var i=[/*
		 ush good_length; /* reduce lazy search above this match length 
		 ush max_lazy;    /* do not perform lazy search above this match length 
         ush nice_length; /* quit search above this match length 
	*//*      good lazy nice chain *//* 0 */[0,0,0,0,0],/* store only *//* 1 */[4,4,8,4,0],/* max speed, no lazy matches *//* 2 */[4,5,16,8,0],/* 3 */[4,6,16,16,0],/* 4 */[4,10,16,32,0],/* lazy matches *//* 5 */[8,16,32,32,0],/* 6 */[8,16,128,128,0],/* 7 */[8,32,128,256,0],/* 8 */[32,128,258,1024,1],/* 9 */[32,258,258,4096,1]][n],a=eY.F.U,s=eY.F._goodIndex,o=(eY.F._hash,eY.F._putsE),l=0,h=r<<3,f=0,d=t.length;if(0==n){for(;l<d;){var u=Math.min(65535,d-l);o(e,h,l+u==d?1:0),h=eY.F._copyExact(t,l,u,e,h+8),l+=u}return h>>>3}var c=a.lits,_=a.strt,p=a.prev,m=0,g=0,v=0,b=0,w=0,y=0;// last_item, literal_count, block_start
for(d>2&&(_[y=eY.F._hash(t,0)]=0),l=0;l<d;l++){//*
if(w=y,l+1<d-2){y=eY.F._hash(t,l+1);var k=l+1&32767;p[k]=_[y],_[y]=k}//*/
if(f<=l){(m>14e3||g>26697)&&d-l>100&&(f<l&&(c[m]=l-f,m+=2,f=l),h=eY.F._writeBlock(l==d-1||f==d?1:0,c,m,b,t,v,l-v,e,h),m=g=b=0,v=l);var x=0;l<d-2&&(x=eY.F._bestMatch(t,l,p,w,Math.min(i[2],d-l),i[3]));/*
			if(mch!=0 && opt[4]==1 && (mch>>>16)<opt[1] && i+1<dlen-2) {
				nmch = UZIP.F._bestMatch(data, i+1, prev, nc, opt[2], opt[3]);  nmci=i+1;
				//var mch2 = UZIP.F._bestMatch(data, i+2, prev, nnc);  //nmci=i+1;
				if((nmch>>>16)>(mch>>>16)) mch=0;
			}//*/var u=x>>>16,z=65535&x;//if(i-dst<0) throw "e";
if(0!=x){var u=x>>>16,z=65535&x,A=s(u,a.of0);//if(i-dst<0) throw "e";
a.lhst[257+A]++;var S=s(z,a.df0);a.dhst[S]++,b+=a.exb[A]+a.dxb[S],c[m]=u<<23|l-f,c[m+1]=z<<16|A<<8|S,m+=2,f=l+u}else a.lhst[t[l]]++;g++}}for((v!=l||0==t.length)&&(f<l&&(c[m]=l-f,m+=2,f=l),h=eY.F._writeBlock(1,c,m,b,t,v,l-v,e,h),m=0,g=0,m=g=b=0,v=l);(7&h)!=0;)h++;return h>>>3},eY.F._bestMatch=function(t,e,r,n,i,a){var s=32767&e,o=r[s],l=s-o+32768&32767;if(o==s||n!=eY.F._hash(t,e-l))return 0;for(var h=0,f=0,d=Math.min(32767,e);l<=d&&0!=--a&&o!=s/*&& c==UZIP.F._hash(data,i-dif)*/;){if(0==h||t[e+h]==t[e+h-l]){var u=eY.F._howLong(t,e,l);if(u>h){if(h=u,f=l,h>=i)break;//* 
l+2<u&&(u=l+2);for(var c=0,_=0;_<u-2;_++){var p=e-l+_+32768&32767,m=r[p],g=p-m+32768&32767;g>c&&(c=g,o=p)}//*/
}}o=r[s=o],l+=s-o+32768&32767}return h<<16|f},eY.F._howLong=function(t,e,r){if(t[e]!=t[e-r]||t[e+1]!=t[e+1-r]||t[e+2]!=t[e+2-r])return 0;var n=e,i=Math.min(t.length,e+258);//while(i+4<l && data[i]==data[i-dif] && data[i+1]==data[i+1-dif] && data[i+2]==data[i+2-dif] && data[i+3]==data[i+3-dif]) i+=4;
for(e+=3;e<i&&t[e]==t[e-r];)e++;return e-n},eY.F._hash=function(t,e){return(t[e]<<8|t[e+1])+(t[e+2]<<4)&65535;//var hash_shift = 0, hash_mask = 255;
//var h = data[i+1] % 251;
//h = (((h << 8) + data[i+2]) % 251);
//h = (((h << 8) + data[i+2]) % 251);
//h = ((h<<hash_shift) ^ (c) ) & hash_mask;
//return h | (data[i]<<8);
//return (data[i] | (data[i+1]<<8));
},//UZIP.___toth = 0;
eY.saved=0,eY.F._writeBlock=function(t,e,r,n,i,a,s,o,l){var h=eY.F.U,f=eY.F._putsF,d=eY.F._putsE;h.lhst[256]++,v=(g=eY.F.getTrees())[0],b=g[1],w=g[2],y=g[3],k=g[4],x=g[5],z=g[6],A=g[7];var u=((l+3&7)==0?0:8-(l+3&7))+32+(s<<3),c=n+eY.F.contSize(h.fltree,h.lhst)+eY.F.contSize(h.fdtree,h.dhst),_=n+eY.F.contSize(h.ltree,h.lhst)+eY.F.contSize(h.dtree,h.dhst);_+=14+3*x+eY.F.contSize(h.itree,h.ihst)+(2*h.ihst[16]+3*h.ihst[17]+7*h.ihst[18]);for(var p=0;p<286;p++)h.lhst[p]=0;for(var p=0;p<30;p++)h.dhst[p]=0;for(var p=0;p<19;p++)h.ihst[p]=0;//*/
var m=u<c&&u<_?0:c<_?1:2;if(f(o,l,t),f(o,l+1,m),l+=3,0==m){for(;(7&l)!=0;)l++;l=eY.F._copyExact(i,a,s,o,l)}else{if(1==m&&(S=h.fltree,E=h.fdtree),2==m){eY.F.makeCodes(h.ltree,v),eY.F.revCodes(h.ltree,v),eY.F.makeCodes(h.dtree,b),eY.F.revCodes(h.dtree,b),eY.F.makeCodes(h.itree,w),eY.F.revCodes(h.itree,w),S=h.ltree,E=h.dtree,d(o,l,y-257),d(o,l+=5,k-1),d(o,l+=5,x-4),l+=4;for(var g,v,b,w,y,k,x,z,A,S,E,C=0;C<x;C++)d(o,l+3*C,h.itree[(h.ordr[C]<<1)+1]);l+=3*x,l=eY.F._codeTiny(z,h.itree,o,l),l=eY.F._codeTiny(A,h.itree,o,l)}for(var F=a,I=0;I<r;I+=2){for(var R=e[I],O=R>>>23,U=F+(8388607&R);F<U;)l=eY.F._writeLit(i[F++],S,o,l);if(0!=O){var T=e[I+1],D=T>>16,B=T>>8&255,N=255&T;l=eY.F._writeLit(257+B,S,o,l),d(o,l,O-h.of0[B]),l+=h.exb[B],l=eY.F._writeLit(N,E,o,l),f(o,l,D-h.df0[N]),l+=h.dxb[N],F+=O}}l=eY.F._writeLit(256,S,o,l)}//console.log(pos-opos, fxdSize, dynSize, cstSize);
return l},eY.F._copyExact=function(t,e,r,n,i){var a=i>>>3;//for(var i=0; i<len; i++) out[p8+i]=data[off+i];
return n[a]=r,n[a+1]=r>>>8,n[a+2]=255-n[a],n[a+3]=255-n[a+1],a+=4,n.set(new Uint8Array(t.buffer,e,r),a),i+(r+4<<3)},/*
	Interesting facts:
	- decompressed block can have bytes, which do not occur in a Huffman tree (copied from the previous block by reference)
*/eY.F.getTrees=function(){for(var t=eY.F.U,e=eY.F._hufTree(t.lhst,t.ltree,15),r=eY.F._hufTree(t.dhst,t.dtree,15),n=[],i=eY.F._lenCodes(t.ltree,n),a=[],s=eY.F._lenCodes(t.dtree,a),o=0;o<n.length;o+=2)t.ihst[n[o]]++;for(var o=0;o<a.length;o+=2)t.ihst[a[o]]++;for(var l=eY.F._hufTree(t.ihst,t.itree,7),h=19;h>4&&0==t.itree[(t.ordr[h-1]<<1)+1];)h--;return[e,r,l,i,s,h,n,a]},eY.F.getSecond=function(t){for(var e=[],r=0;r<t.length;r+=2)e.push(t[r+1]);return e},eY.F.nonZero=function(t){for(var e="",r=0;r<t.length;r+=2)0!=t[r+1]&&(e+=(r>>1)+",");return e},eY.F.contSize=function(t,e){for(var r=0,n=0;n<e.length;n++)r+=e[n]*t[(n<<1)+1];return r},eY.F._codeTiny=function(t,e,r,n){for(var i=0;i<t.length;i+=2){var a=t[i],s=t[i+1];//console.log(l, pos, tree[(l<<1)+1]);
n=eY.F._writeLit(a,e,r,n);var o=16==a?2:17==a?3:7;a>15&&(eY.F._putsE(r,n,s,o),n+=o)}return n},eY.F._lenCodes=function(t,e){for(var r=t.length;2!=r&&0==t[r-1];)r-=2;// when no distances, keep one code with length 0
for(var n=0;n<r;n+=2){var i=t[n+1],a=n+3<r?t[n+3]:-1,s=n+5<r?t[n+5]:-1,o=0==n?-1:t[n-1];if(0==i&&a==i&&s==i){for(var l=n+5;l+2<r&&t[l+2]==i;)l+=2;var h=Math.min(l+1-n>>>1,138);h<11?e.push(17,h-3):e.push(18,h-11),n+=2*h-2}else if(i==o&&a==i&&s==i){for(var l=n+5;l+2<r&&t[l+2]==i;)l+=2;var h=Math.min(l+1-n>>>1,6);e.push(16,h-3),n+=2*h-2}else e.push(i,0)}return r>>>1},eY.F._hufTree=function(t,e,r){var n=[],i=t.length,a=e.length,s=0;for(s=0;s<a;s+=2)e[s]=0,e[s+1]=0;for(s=0;s<i;s++)0!=t[s]&&n.push({lit:s,f:t[s]});var o=n.length,l=n.slice(0);if(0==o)return 0;// empty histogram (usually for dist)
if(1==o){var h=n[0].lit,l=0==h?1:0;return e[(h<<1)+1]=1,e[(l<<1)+1]=1,1}n.sort(function(t,e){return t.f-e.f});var f=n[0],d=n[1],u=0,c=1,_=2;for(n[0]={lit:-1,f:f.f+d.f,l:f,r:d,d:0};c!=o-1;)f=u!=c&&(_==o||n[u].f<n[_].f)?n[u++]:n[_++],d=u!=c&&(_==o||n[u].f<n[_].f)?n[u++]:n[_++],n[c++]={lit:-1,f:f.f+d.f,l:f,r:d};var p=eY.F.setDepth(n[c-1],0);for(p>r&&(eY.F.restrictDepth(l,r,p),p=r),s=0;s<o;s++)e[(l[s].lit<<1)+1]=l[s].d;return p},eY.F.setDepth=function(t,e){return -1!=t.lit?(t.d=e,e):Math.max(eY.F.setDepth(t.l,e+1),eY.F.setDepth(t.r,e+1))},eY.F.restrictDepth=function(t,e,r){var n=0,i=1<<r-e,a=0;for(t.sort(function(t,e){return e.d==t.d?t.f-e.f:e.d-t.d}),n=0;n<t.length;n++)if(t[n].d>e){var s=t[n].d;t[n].d=e,a+=i-(1<<r-s)}else break;for(a>>>=r-e;a>0;){var s=t[n].d;s<e?(t[n].d++,a-=1<<e-s-1):n++}for(;n>=0;n--)t[n].d==e&&a<0&&(t[n].d--,a++);0!=a&&console.log("debt left")},eY.F._goodIndex=function(t,e){var r=0;return e[16]<=t&&(r|=16),e[8|r]<=t&&(r|=8),e[4|r]<=t&&(r|=4),e[2|r]<=t&&(r|=2),e[1|r]<=t&&(r|=1),r},eY.F._writeLit=function(t,e,r,n){return eY.F._putsF(r,n,e[t<<1]),n+e[(t<<1)+1]},eY.F.inflate=function(t,e){var r,n,i=Uint8Array;if(3==t[0]&&0==t[1])return e||new i(0);var a=eY.F,s=a._bitsF,o=a._bitsE,l=a._decodeTiny,h=a.makeCodes,f=a.codes2map,d=a._get17,u=a.U,c=null==e;c&&(e=new i(t.length>>>2<<3));for(var _=0,p=0,m=0,g=0,v=0,b=0,w=0,y=0,k=0;0==_;){//console.log(BFINAL, BTYPE);
if(_=s(t,k,1),p=s(t,k+1,2),k+=3,0==p){(7&k)!=0&&(k+=8-(7&k));var x=(k>>>3)+4,z=t[x-4]|t[x-3]<<8;//console.log(len);//bitsF(data, pos, 16), 
c&&(e=eY.F._check(e,y+z)),e.set(new i(t.buffer,t.byteOffset+x,z),y),//for(var i=0; i<len; i++) buf[off+i] = data[p8+i];
//for(var i=0; i<len; i++) if(buf[off+i] != data[p8+i]) throw "e";
k=x+z<<3,y+=z;continue}if(c&&(e=eY.F._check(e,y+131072)),1==p&&(r=u.flmap,n=u.fdmap,b=511,w=31),2==p){m=o(t,k,5)+257,g=o(t,k+5,5)+1,v=o(t,k+10,4)+4,k+=14;for(var A=0;A<38;A+=2)u.itree[A]=0,u.itree[A+1]=0;for(var S=1,A=0;A<v;A++){var E=o(t,k+3*A,3);u.itree[(u.ordr[A]<<1)+1]=E,E>S&&(S=E)}k+=3*v,h(u.itree,S),f(u.itree,S,u.imap),r=u.lmap,n=u.dmap,k=l(u.imap,(1<<S)-1,m+g,t,k,u.ttree);var C=a._copyOut(u.ttree,0,m,u.ltree);b=(1<<C)-1;var F=a._copyOut(u.ttree,m,g,u.dtree);w=(1<<F)-1,//var ml = decodeTiny(U.imap, (1<<tl)-1, HLIT , data, pos, U.ltree); ML = (1<<(ml>>>24))-1;  pos+=(ml&0xffffff);
h(u.ltree,C),f(u.ltree,C,r),//var md = decodeTiny(U.imap, (1<<tl)-1, HDIST, data, pos, U.dtree); MD = (1<<(md>>>24))-1;  pos+=(md&0xffffff);
h(u.dtree,F),f(u.dtree,F,n)}//var ooff=off, opos=pos;
for(;;){var I=r[d(t,k)&b];k+=15&I;var R=I>>>4;//U.lhst[lit]++;  
if(R>>>8==0)e[y++]=R;else if(256==R)break;else{var O=y+R-254;if(R>264){var U=u.ldef[R-257];O=y+(U>>>3)+o(t,k,7&U),k+=7&U}//UZIP.F.dst[end-off]++;
var T=n[d(t,k)&w];k+=15&T;var D=T>>>4,B=u.ddef[D],N=(B>>>4)+s(t,k,15&B);for(k+=15&B,c&&(e=eY.F._check(e,y+131072));y<O;)e[y]=e[y++-N],e[y]=e[y++-N],e[y]=e[y++-N],e[y]=e[y++-N];y=O;//while(off!=end) {  buf[off]=buf[off++-dst];  }
}}//console.log(off-ooff, (pos-opos)>>>3);
}//console.log(UZIP.F.dst);
//console.log(tlen, dlen, off-tlen+tcnt);
return e.length==y?e:e.slice(0,y)},eY.F._check=function(t,e){var r=t.length;if(e<=r)return t;var n=new Uint8Array(Math.max(r<<1,e));//for(var i=0; i<bl; i+=4) {  nbuf[i]=buf[i];  nbuf[i+1]=buf[i+1];  nbuf[i+2]=buf[i+2];  nbuf[i+3]=buf[i+3];  }
return n.set(t,0),n},eY.F._decodeTiny=function(t,e,r,n,i,a){for(var s=eY.F._bitsE,o=eY.F._get17,l=0;l<r;){var h=t[o(n,i)&e];i+=15&h;var f=h>>>4;if(f<=15)a[l]=f,l++;else{var d=0,u=0;16==f?(u=3+s(n,i,2),i+=2,d=a[l-1]):17==f?(u=3+s(n,i,3),i+=3):18==f&&(u=11+s(n,i,7),i+=7);for(var c=l+u;l<c;)a[l]=d,l++}}return i},eY.F._copyOut=function(t,e,r,n){for(var i=0,a=0,s=n.length>>>1;a<r;){var o=t[a+e];n[a<<1]=0,n[(a<<1)+1]=o,o>i&&(i=o),a++}for(;a<s;)n[a<<1]=0,n[(a<<1)+1]=0,a++;return i},eY.F.makeCodes=function(t,e){for(var r,n,i,a,s,o=eY.F.U,l=t.length,h=o.bl_count,a=0;a<=e;a++)h[a]=0;for(a=1;a<l;a+=2)h[t[a]]++;var f=o.next_code;// smallest code for each length
for(n=1,r=0,h[0]=0;n<=e;n++)r=r+h[n-1]<<1,f[n]=r;for(i=0;i<l;i+=2)0!=(s=t[i+1])&&(t[i]=f[s],f[s]++)},eY.F.codes2map=function(t,e,r){for(var n=t.length,i=eY.F.U.rev15,a=0;a<n;a+=2)if(0!=t[a+1])//tree[i]=r15[i0]>>>(15-MAX_BITS);
for(var s=a>>1,o=t[a+1],l=s<<4|o,h=e-o,f=t[a]<<h,d=f+(1<<h);f!=d;)r[i[f]>>>15-e]=l,f++},eY.F.revCodes=function(t,e){for(var r=eY.F.U.rev15,n=15-e,i=0;i<t.length;i+=2){var a=t[i]<<e-t[i+1];t[i]=r[a]>>>n}},// used only in deflate
eY.F._putsE=function(t,e,r){r<<=7&e;var n=e>>>3;t[n]|=r,t[n+1]|=r>>>8},eY.F._putsF=function(t,e,r){r<<=7&e;var n=e>>>3;t[n]|=r,t[n+1]|=r>>>8,t[n+2]|=r>>>16},eY.F._bitsE=function(t,e,r){return(t[e>>>3]|t[(e>>>3)+1]<<8)>>>(7&e)&(1<<r)-1},eY.F._bitsF=function(t,e,r){return(t[e>>>3]|t[(e>>>3)+1]<<8|t[(e>>>3)+2]<<16)>>>(7&e)&(1<<r)-1},/*
UZIP.F._get9 = function(dt, pos) {
	return ((dt[pos>>>3] | (dt[(pos>>>3)+1]<<8))>>>(pos&7))&511;
} */eY.F._get17=function(t,e){return(t[e>>>3]|t[(e>>>3)+1]<<8|t[(e>>>3)+2]<<16)>>>(7&e)},eY.F._get25=function(t,e){return(t[e>>>3]|t[(e>>>3)+1]<<8|t[(e>>>3)+2]<<16|t[(e>>>3)+3]<<24)>>>(7&e)},eY.F.U=(e=Uint16Array,r=Uint32Array,{next_code:new e(16),bl_count:new e(16),ordr:[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],of0:[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,999,999,999],exb:[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0],ldef:new e(32),df0:[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,65535,65535],dxb:[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0],ddef:new r(32),flmap:new e(512),fltree:[],fdmap:new e(32),fdtree:[],lmap:new e(32768),ltree:[],ttree:[],dmap:new e(32768),dtree:[],imap:new e(512),itree:[],//rev9 : new u16(  512)
rev15:new e(32768),lhst:new r(286),dhst:new r(30),ihst:new r(19),lits:new r(15e3),strt:new e(65536),prev:new e(32768)}),function(){for(var t=eY.F.U,e=0;e<32768;e++){var r=e;r=(4278255360&(r=(4042322160&(r=(3435973836&(r=(2863311530&r)>>>1|(1431655765&r)<<1))>>>2|(858993459&r)<<2))>>>4|(252645135&r)<<4))>>>8|(16711935&r)<<8,t.rev15[e]=(r>>>16|r<<16)>>>17}function n(t,e,r){for(;0!=e--;)t.push(0,r)}for(var e=0;e<32;e++)t.ldef[e]=t.of0[e]<<3|t.exb[e],t.ddef[e]=t.df0[e]<<4|t.dxb[e];n(t.fltree,144,8),n(t.fltree,112,9),n(t.fltree,24,7),n(t.fltree,8,8),/*
	var i = 0;
	for(; i<=143; i++) U.fltree.push(0,8);
	for(; i<=255; i++) U.fltree.push(0,9);
	for(; i<=279; i++) U.fltree.push(0,7);
	for(; i<=287; i++) U.fltree.push(0,8);
	*/eY.F.makeCodes(t.fltree,9),eY.F.codes2map(t.fltree,9,t.flmap),eY.F.revCodes(t.fltree,9),n(t.fdtree,32,5),//for(i=0;i<32; i++) U.fdtree.push(0,5);
eY.F.makeCodes(t.fdtree,5),eY.F.codes2map(t.fdtree,5,t.fdmap),eY.F.revCodes(t.fdtree,5),n(t.itree,19,0),n(t.ltree,286,0),n(t.dtree,30,0),n(t.ttree,320,0);/*
	for(var i=0; i< 19; i++) U.itree.push(0,0);
	for(var i=0; i<286; i++) U.ltree.push(0,0);
	for(var i=0; i< 30; i++) U.dtree.push(0,0);
	for(var i=0; i<320; i++) U.ttree.push(0,0);
	*/}();var eX={},eV={},eJ=eV.Buffer;eX=(function t(e,r,n){function i(s,o){if(!r[s]){if(!e[s]){var l=void 0;if(!o&&l)return l(s,!0);if(a)return a(s,!0);var h=Error("Cannot find module '"+s+"'");throw h.code="MODULE_NOT_FOUND",h}var f=r[s]={exports:{}};e[s][0].call(f.exports,function(t){return i(e[s][1][t]||t)},f,f.exports,t,e,r,n)}return r[s].exports}for(var a=void 0,s=0;s<n.length;s++)i(n[s]);return i})({1:[function(t,e,r){var n=t("./utils"),i=t("./support"),a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(t){for(var e,r,i,s,o,l,h,f=[],d=0,u=t.length,c=u,_="string"!==n.getTypeOf(t);d<t.length;)c=u-d,i=_?(e=t[d++],r=d<u?t[d++]:0,d<u?t[d++]:0):(e=t.charCodeAt(d++),r=d<u?t.charCodeAt(d++):0,d<u?t.charCodeAt(d++):0),s=e>>2,o=(3&e)<<4|r>>4,l=1<c?(15&r)<<2|i>>6:64,h=2<c?63&i:64,f.push(a.charAt(s)+a.charAt(o)+a.charAt(l)+a.charAt(h));return f.join("")},r.decode=function(t){var e,r,n,s,o,l,h=0,f=0,d="data:";if(t.substr(0,d.length)===d)throw Error("Invalid base64 input, it looks like a data url.");var u,c=3*(t=t.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(t.charAt(t.length-1)===a.charAt(64)&&c--,t.charAt(t.length-2)===a.charAt(64)&&c--,c%1!=0)throw Error("Invalid base64 input, bad content length.");for(u=i.uint8array?new Uint8Array(0|c):Array(0|c);h<t.length;)e=a.indexOf(t.charAt(h++))<<2|(s=a.indexOf(t.charAt(h++)))>>4,r=(15&s)<<4|(o=a.indexOf(t.charAt(h++)))>>2,n=(3&o)<<6|(l=a.indexOf(t.charAt(h++))),u[f++]=e,64!==o&&(u[f++]=r),64!==l&&(u[f++]=n);return u}},{"./support":30,"./utils":32}],2:[function(t,e,r){var n=t("./external"),i=t("./stream/DataWorker"),a=t("./stream/Crc32Probe"),s=t("./stream/DataLengthProbe");function o(t,e,r,n,i){this.compressedSize=t,this.uncompressedSize=e,this.crc32=r,this.compression=n,this.compressedContent=i}o.prototype={getContentWorker:function(){var t=new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new s("data_length")),e=this;return t.on("end",function(){if(this.streamInfo.data_length!==e.uncompressedSize)throw Error("Bug : uncompressed data size mismatch")}),t},getCompressedWorker:function(){return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(t,e,r){return t.pipe(new a).pipe(new s("uncompressedSize")).pipe(e.compressWorker(r)).pipe(new s("compressedSize")).withStreamInfo("compression",e)},e.exports=o},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(t,e,r){var n=t("./stream/GenericWorker");r.STORE={magic:"\x00\x00",compressWorker:function(){return new n("STORE compression")},uncompressWorker:function(){return new n("STORE decompression")}},r.DEFLATE=t("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(t,e,r){var n=t("./utils"),i=function(){for(var t,e=[],r=0;r<256;r++){t=r;for(var n=0;n<8;n++)t=1&t?3988292384^t>>>1:t>>>1;e[r]=t}return e}();e.exports=function(t,e){return void 0!==t&&t.length?"string"!==n.getTypeOf(t)?function(t,e,r,n){var a=n+r;t^=-1;for(var s=n;s<a;s++)t=t>>>8^i[255&(t^e[s])];return -1^t}(0|e,t,t.length,0):function(t,e,r,n){var a=n+r;t^=-1;for(var s=n;s<a;s++)t=t>>>8^i[255&(t^e.charCodeAt(s))];return -1^t}(0|e,t,t.length,0):0}},{"./utils":32}],5:[function(t,e,r){r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null},{}],6:[function(t,e,r){var n=null;n="undefined"!=typeof Promise?Promise:t("lie"),e.exports={Promise:n}},{lie:37}],7:[function(t,e,r){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,i=t("pako"),a=t("./utils"),s=t("./stream/GenericWorker"),o=n?"uint8array":"array";function l(t,e){s.call(this,"FlateWorker/"+t),this._pako=null,this._pakoAction=t,this._pakoOptions=e,this.meta={}}r.magic="\b\x00",a.inherits(l,s),l.prototype.processChunk=function(t){this.meta=t.meta,null===this._pako&&this._createPako(),this._pako.push(a.transformTo(o,t.data),!1)},l.prototype.flush=function(){s.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},l.prototype.cleanUp=function(){s.prototype.cleanUp.call(this),this._pako=null},l.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var t=this;this._pako.onData=function(e){t.push({data:e,meta:t.meta})}},r.compressWorker=function(t){return new l("Deflate",t)},r.uncompressWorker=function(){return new l("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(t,e,r){function n(t,e){var r,n="";for(r=0;r<e;r++)n+=String.fromCharCode(255&t),t>>>=8;return n}function i(t,e,r,i,s,f){var d,u,c,_,p=t.file,m=t.compression,g=f!==o.utf8encode,v=a.transformTo("string",f(p.name)),b=a.transformTo("string",o.utf8encode(p.name)),w=p.comment,y=a.transformTo("string",f(w)),k=a.transformTo("string",o.utf8encode(w)),x=b.length!==p.name.length,z=k.length!==w.length,A="",S="",E="",C=p.dir,F=p.date,I={crc32:0,compressedSize:0,uncompressedSize:0};e&&!r||(I.crc32=t.crc32,I.compressedSize=t.compressedSize,I.uncompressedSize=t.uncompressedSize);var R=0;e&&(R|=8),!g&&(x||z)&&(R|=2048);var O=0,U=0;C&&(O|=16),"UNIX"===s?(U=798,O|=(u=d=p.unixPermissions,d||(u=C?16893:33204),(65535&u)<<16)):(U=20,O|=63&(p.dosPermissions||0)),c=(F.getUTCHours()<<6|F.getUTCMinutes())<<5|F.getUTCSeconds()/2,_=(F.getUTCFullYear()-1980<<4|F.getUTCMonth()+1)<<5|F.getUTCDate(),x&&(S=n(1,1)+n(l(v),4)+b,A+="up"+n(S.length,2)+S),z&&(E=n(1,1)+n(l(y),4)+k,A+="uc"+n(E.length,2)+E);var T="";return T+="\n\x00"+n(R,2)+m.magic+n(c,2)+n(_,2)+n(I.crc32,4)+n(I.compressedSize,4)+n(I.uncompressedSize,4)+n(v.length,2)+n(A.length,2),{fileRecord:h.LOCAL_FILE_HEADER+T+v+A,dirRecord:h.CENTRAL_FILE_HEADER+n(U,2)+T+n(y.length,2)+"\x00\x00\x00\x00"+n(O,4)+n(i,4)+v+A+y}}var a=t("../utils"),s=t("../stream/GenericWorker"),o=t("../utf8"),l=t("../crc32"),h=t("../signature");function f(t,e,r,n){s.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=e,this.zipPlatform=r,this.encodeFileName=n,this.streamFiles=t,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}a.inherits(f,s),f.prototype.push=function(t){var e=t.meta.percent||0,r=this.entriesCount,n=this._sources.length;this.accumulate?this.contentBuffer.push(t):(this.bytesWritten+=t.data.length,s.prototype.push.call(this,{data:t.data,meta:{currentFile:this.currentFile,percent:r?(e+100*(r-n-1))/r:100}}))},f.prototype.openedSource=function(t){this.currentSourceOffset=this.bytesWritten,this.currentFile=t.file.name;var e=this.streamFiles&&!t.file.dir;if(e){var r=i(t,e,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}})}else this.accumulate=!0},f.prototype.closedSource=function(t){this.accumulate=!1;var e=this.streamFiles&&!t.file.dir,r=i(t,e,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(r.dirRecord),e)this.push({data:h.DATA_DESCRIPTOR+n(t.crc32,4)+n(t.compressedSize,4)+n(t.uncompressedSize,4),meta:{percent:100}});else for(this.push({data:r.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},f.prototype.flush=function(){for(var t,e,r,i,s=this.bytesWritten,o=0;o<this.dirRecords.length;o++)this.push({data:this.dirRecords[o],meta:{percent:100}});var l=this.bytesWritten-s,f=(t=this.dirRecords.length,e=this.zipComment,r=this.encodeFileName,i=a.transformTo("string",r(e)),h.CENTRAL_DIRECTORY_END+"\x00\x00\x00\x00"+n(t,2)+n(t,2)+n(l,4)+n(s,4)+n(i.length,2)+i);this.push({data:f,meta:{percent:100}})},f.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},f.prototype.registerPrevious=function(t){this._sources.push(t);var e=this;return t.on("data",function(t){e.processChunk(t)}),t.on("end",function(){e.closedSource(e.previous.streamInfo),e._sources.length?e.prepareNextSource():e.end()}),t.on("error",function(t){e.error(t)}),this},f.prototype.resume=function(){return!!s.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},f.prototype.error=function(t){var e=this._sources;if(!s.prototype.error.call(this,t))return!1;for(var r=0;r<e.length;r++)try{e[r].error(t)}catch(t){}return!0},f.prototype.lock=function(){s.prototype.lock.call(this);for(var t=this._sources,e=0;e<t.length;e++)t[e].lock()},e.exports=f},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(t,e,r){var n=t("../compressions"),i=t("./ZipFileWorker");r.generateWorker=function(t,e,r){var a=new i(e.streamFiles,r,e.platform,e.encodeFileName),s=0;try{t.forEach(function(t,r){s++;var i=function(t,e){var r=t||e,i=n[r];if(!i)throw Error(r+" is not a valid compression method !");return i}(r.options.compression,e.compression),o=r.options.compressionOptions||e.compressionOptions||{},l=r.dir,h=r.date;r._compressWorker(i,o).withStreamInfo("file",{name:t,dir:l,date:h,comment:r.comment||"",unixPermissions:r.unixPermissions,dosPermissions:r.dosPermissions}).pipe(a)}),a.entriesCount=s}catch(t){a.error(t)}return a}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(t,e,r){function n(){if(!(this instanceof n))return new n;if(arguments.length)throw Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var t=new n;for(var e in this)"function"!=typeof this[e]&&(t[e]=this[e]);return t}}(n.prototype=t("./object")).loadAsync=t("./load"),n.support=t("./support"),n.defaults=t("./defaults"),n.version="3.10.1",n.loadAsync=function(t,e){return(new n).loadAsync(t,e)},n.external=t("./external"),e.exports=n},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(t,e,r){var n=t("./utils"),i=t("./external"),a=t("./utf8"),s=t("./zipEntries"),o=t("./stream/Crc32Probe"),l=t("./nodejsUtils");e.exports=function(t,e){var r=this;return e=n.extend(e||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:a.utf8decode}),l.isNode&&l.isStream(t)?i.Promise.reject(Error("JSZip can't accept a stream when loading a zip file.")):n.prepareContent("the loaded zip file",t,!0,e.optimizedBinaryString,e.base64).then(function(t){var r=new s(e);return r.load(t),r}).then(function(t){var r=[i.Promise.resolve(t)],n=t.files;if(e.checkCRC32)for(var a=0;a<n.length;a++)r.push(function(t){return new i.Promise(function(e,r){var n=t.decompressed.getContentWorker().pipe(new o);n.on("error",function(t){r(t)}).on("end",function(){n.streamInfo.crc32!==t.decompressed.crc32?r(Error("Corrupted zip : CRC32 mismatch")):e()}).resume()})}(n[a]));return i.Promise.all(r)}).then(function(t){for(var i=t.shift(),a=i.files,s=0;s<a.length;s++){var o=a[s],l=o.fileNameStr,h=n.resolve(o.fileNameStr);r.file(h,o.decompressed,{binary:!0,optimizedBinaryString:!0,date:o.date,dir:o.dir,comment:o.fileCommentStr.length?o.fileCommentStr:null,unixPermissions:o.unixPermissions,dosPermissions:o.dosPermissions,createFolders:e.createFolders}),o.dir||(r.file(h).unsafeOriginalName=l)}return i.zipComment.length&&(r.comment=i.zipComment),r})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(t,e,r){var n=t("../utils"),i=t("../stream/GenericWorker");function a(t,e){i.call(this,"Nodejs stream input adapter for "+t),this._upstreamEnded=!1,this._bindStream(e)}n.inherits(a,i),a.prototype._bindStream=function(t){var e=this;(this._stream=t).pause(),t.on("data",function(t){e.push({data:t,meta:{percent:0}})}).on("error",function(t){e.isPaused?this.generatedError=t:e.error(t)}).on("end",function(){e.isPaused?e._upstreamEnded=!0:e.end()})},a.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},a.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},e.exports=a},{"../stream/GenericWorker":28,"../utils":32}],13:[function(t,e,r){var n=t("readable-stream").Readable;function i(t,e,r){n.call(this,e),this._helper=t;var i=this;t.on("data",function(t,e){i.push(t)||i._helper.pause(),r&&r(e)}).on("error",function(t){i.emit("error",t)}).on("end",function(){i.push(null)})}t("../utils").inherits(i,n),i.prototype._read=function(){this._helper.resume()},e.exports=i},{"../utils":32,"readable-stream":16}],14:[function(t,e,r){e.exports={isNode:void 0!==eJ,newBufferFrom:function(t,e){if(eJ.from&&eJ.from!==Uint8Array.from)return eJ.from(t,e);if("number"==typeof t)throw Error('The "data" argument must not be a number');return new eJ(t,e)},allocBuffer:function(t){if(eJ.alloc)return eJ.alloc(t);var e=new eJ(t);return e.fill(0),e},isBuffer:function(t){return eJ.isBuffer(t)},isStream:function(t){return t&&"function"==typeof t.on&&"function"==typeof t.pause&&"function"==typeof t.resume}}},{}],15:[function(t,e,r){function n(t,e,r){var n,i=a.getTypeOf(e),o=a.extend(r||{},l);o.date=o.date||new Date,null!==o.compression&&(o.compression=o.compression.toUpperCase()),"string"==typeof o.unixPermissions&&(o.unixPermissions=parseInt(o.unixPermissions,8)),o.unixPermissions&&16384&o.unixPermissions&&(o.dir=!0),o.dosPermissions&&16&o.dosPermissions&&(o.dir=!0),o.dir&&(t=p(t)),o.createFolders&&(n=_(t))&&m.call(this,n,!0);var d="string"===i&&!1===o.binary&&!1===o.base64;r&&void 0!==r.binary||(o.binary=!d),(e instanceof h&&0===e.uncompressedSize||o.dir||!e||0===e.length)&&(o.base64=!1,o.binary=!0,e="",o.compression="STORE",i="string");var g=null;g=e instanceof h||e instanceof s?e:u.isNode&&u.isStream(e)?new c(t,e):a.prepareContent(t,e,o.binary,o.optimizedBinaryString,o.base64);var v=new f(t,g,o);this.files[t]=v}var i=t("./utf8"),a=t("./utils"),s=t("./stream/GenericWorker"),o=t("./stream/StreamHelper"),l=t("./defaults"),h=t("./compressedObject"),f=t("./zipObject"),d=t("./generate"),u=t("./nodejsUtils"),c=t("./nodejs/NodejsStreamInputAdapter"),_=function(t){"/"===t.slice(-1)&&(t=t.substring(0,t.length-1));var e=t.lastIndexOf("/");return 0<e?t.substring(0,e):""},p=function(t){return"/"!==t.slice(-1)&&(t+="/"),t},m=function(t,e){return e=void 0!==e?e:l.createFolders,t=p(t),this.files[t]||n.call(this,t,null,{dir:!0,createFolders:e}),this.files[t]};function g(t){return"[object RegExp]"===Object.prototype.toString.call(t)}e.exports={load:function(){throw Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(t){var e,r,n;for(e in this.files)n=this.files[e],(r=e.slice(this.root.length,e.length))&&e.slice(0,this.root.length)===this.root&&t(r,n)},filter:function(t){var e=[];return this.forEach(function(r,n){t(r,n)&&e.push(n)}),e},file:function(t,e,r){if(1!=arguments.length)return t=this.root+t,n.call(this,t,e,r),this;if(g(t)){var i=t;return this.filter(function(t,e){return!e.dir&&i.test(t)})}var a=this.files[this.root+t];return a&&!a.dir?a:null},folder:function(t){if(!t)return this;if(g(t))return this.filter(function(e,r){return r.dir&&t.test(e)});var e=this.root+t,r=m.call(this,e),n=this.clone();return n.root=r.name,n},remove:function(t){t=this.root+t;var e=this.files[t];if(e||("/"!==t.slice(-1)&&(t+="/"),e=this.files[t]),e&&!e.dir)delete this.files[t];else for(var r=this.filter(function(e,r){return r.name.slice(0,t.length)===t}),n=0;n<r.length;n++)delete this.files[r[n].name];return this},generate:function(){throw Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(t){var e,r={};try{if((r=a.extend(t||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw Error("No output type specified.");a.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var n=r.comment||this.comment||"";e=d.generateWorker(this,r,n)}catch(t){(e=new s("error")).error(t)}return new o(e,r.type||"string",r.mimeType)},generateAsync:function(t,e){return this.generateInternalStream(t).accumulate(e)},generateNodeStream:function(t,e){return(t=t||{}).type||(t.type="nodebuffer"),this.generateInternalStream(t).toNodejsStream(e)}}},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(t,e,r){e.exports=t("stream")},{stream:void 0}],17:[function(t,e,r){var n=t("./DataReader");function i(t){n.call(this,t);for(var e=0;e<this.data.length;e++)t[e]=255&t[e]}t("../utils").inherits(i,n),i.prototype.byteAt=function(t){return this.data[this.zero+t]},i.prototype.lastIndexOfSignature=function(t){for(var e=t.charCodeAt(0),r=t.charCodeAt(1),n=t.charCodeAt(2),i=t.charCodeAt(3),a=this.length-4;0<=a;--a)if(this.data[a]===e&&this.data[a+1]===r&&this.data[a+2]===n&&this.data[a+3]===i)return a-this.zero;return -1},i.prototype.readAndCheckSignature=function(t){var e=t.charCodeAt(0),r=t.charCodeAt(1),n=t.charCodeAt(2),i=t.charCodeAt(3),a=this.readData(4);return e===a[0]&&r===a[1]&&n===a[2]&&i===a[3]},i.prototype.readData=function(t){if(this.checkOffset(t),0===t)return[];var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=i},{"../utils":32,"./DataReader":18}],18:[function(t,e,r){var n=t("../utils");function i(t){this.data=t,this.length=t.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(t){this.checkIndex(this.index+t)},checkIndex:function(t){if(this.length<this.zero+t||t<0)throw Error("End of data reached (data length = "+this.length+", asked index = "+t+"). Corrupted zip ?")},setIndex:function(t){this.checkIndex(t),this.index=t},skip:function(t){this.setIndex(this.index+t)},byteAt:function(){},readInt:function(t){var e,r=0;for(this.checkOffset(t),e=this.index+t-1;e>=this.index;e--)r=(r<<8)+this.byteAt(e);return this.index+=t,r},readString:function(t){return n.transformTo("string",this.readData(t))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var t=this.readInt(4);return new Date(Date.UTC(1980+(t>>25&127),(t>>21&15)-1,t>>16&31,t>>11&31,t>>5&63,(31&t)<<1))}},e.exports=i},{"../utils":32}],19:[function(t,e,r){var n=t("./Uint8ArrayReader");function i(t){n.call(this,t)}t("../utils").inherits(i,n),i.prototype.readData=function(t){this.checkOffset(t);var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(t,e,r){var n=t("./DataReader");function i(t){n.call(this,t)}t("../utils").inherits(i,n),i.prototype.byteAt=function(t){return this.data.charCodeAt(this.zero+t)},i.prototype.lastIndexOfSignature=function(t){return this.data.lastIndexOf(t)-this.zero},i.prototype.readAndCheckSignature=function(t){return t===this.readData(4)},i.prototype.readData=function(t){this.checkOffset(t);var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=i},{"../utils":32,"./DataReader":18}],21:[function(t,e,r){var n=t("./ArrayReader");function i(t){n.call(this,t)}t("../utils").inherits(i,n),i.prototype.readData=function(t){if(this.checkOffset(t),0===t)return new Uint8Array(0);var e=this.data.subarray(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(t,e,r){var n=t("../utils"),i=t("../support"),a=t("./ArrayReader"),s=t("./StringReader"),o=t("./NodeBufferReader"),l=t("./Uint8ArrayReader");e.exports=function(t){var e=n.getTypeOf(t);return n.checkSupport(e),"string"!==e||i.uint8array?"nodebuffer"===e?new o(t):i.uint8array?new l(n.transformTo("uint8array",t)):new a(n.transformTo("array",t)):new s(t)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(t,e,r){r.LOCAL_FILE_HEADER="PK\x03\x04",r.CENTRAL_FILE_HEADER="PK\x01\x02",r.CENTRAL_DIRECTORY_END="PK\x05\x06",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x06\x07",r.ZIP64_CENTRAL_DIRECTORY_END="PK\x06\x06",r.DATA_DESCRIPTOR="PK\x07\b"},{}],24:[function(t,e,r){var n=t("./GenericWorker"),i=t("../utils");function a(t){n.call(this,"ConvertWorker to "+t),this.destType=t}i.inherits(a,n),a.prototype.processChunk=function(t){this.push({data:i.transformTo(this.destType,t.data),meta:t.meta})},e.exports=a},{"../utils":32,"./GenericWorker":28}],25:[function(t,e,r){var n=t("./GenericWorker"),i=t("../crc32");function a(){n.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}t("../utils").inherits(a,n),a.prototype.processChunk=function(t){this.streamInfo.crc32=i(t.data,this.streamInfo.crc32||0),this.push(t)},e.exports=a},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(t,e,r){var n=t("../utils"),i=t("./GenericWorker");function a(t){i.call(this,"DataLengthProbe for "+t),this.propName=t,this.withStreamInfo(t,0)}n.inherits(a,i),a.prototype.processChunk=function(t){if(t){var e=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=e+t.data.length}i.prototype.processChunk.call(this,t)},e.exports=a},{"../utils":32,"./GenericWorker":28}],27:[function(t,e,r){var n=t("../utils"),i=t("./GenericWorker");function a(t){i.call(this,"DataWorker");var e=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,t.then(function(t){e.dataIsReady=!0,e.data=t,e.max=t&&t.length||0,e.type=n.getTypeOf(t),e.isPaused||e._tickAndRepeat()},function(t){e.error(t)})}n.inherits(a,i),a.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},a.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,n.delay(this._tickAndRepeat,[],this)),!0)},a.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(n.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},a.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var t=null,e=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":t=this.data.substring(this.index,e);break;case"uint8array":t=this.data.subarray(this.index,e);break;case"array":case"nodebuffer":t=this.data.slice(this.index,e)}return this.index=e,this.push({data:t,meta:{percent:this.max?this.index/this.max*100:0}})},e.exports=a},{"../utils":32,"./GenericWorker":28}],28:[function(t,e,r){function n(t){this.name=t||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}n.prototype={push:function(t){this.emit("data",t)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(t){this.emit("error",t)}return!0},error:function(t){return!this.isFinished&&(this.isPaused?this.generatedError=t:(this.isFinished=!0,this.emit("error",t),this.previous&&this.previous.error(t),this.cleanUp()),!0)},on:function(t,e){return this._listeners[t].push(e),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(t,e){if(this._listeners[t])for(var r=0;r<this._listeners[t].length;r++)this._listeners[t][r].call(this,e)},pipe:function(t){return t.registerPrevious(this)},registerPrevious:function(t){if(this.isLocked)throw Error("The stream '"+this+"' has already been used.");this.streamInfo=t.streamInfo,this.mergeStreamInfo(),this.previous=t;var e=this;return t.on("data",function(t){e.processChunk(t)}),t.on("end",function(){e.end()}),t.on("error",function(t){e.error(t)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var t=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),t=!0),this.previous&&this.previous.resume(),!t},flush:function(){},processChunk:function(t){this.push(t)},withStreamInfo:function(t,e){return this.extraStreamInfo[t]=e,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var t in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,t)&&(this.streamInfo[t]=this.extraStreamInfo[t])},lock:function(){if(this.isLocked)throw Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var t="Worker "+this.name;return this.previous?this.previous+" -> "+t:t}},e.exports=n},{}],29:[function(t,e,r){var n=t("../utils"),i=t("./ConvertWorker"),a=t("./GenericWorker"),s=t("../base64"),o=t("../support"),l=t("../external"),h=null;if(o.nodestream)try{h=t("../nodejs/NodejsStreamOutputAdapter")}catch(t){}function f(t,e,r){var s=e;switch(e){case"blob":case"arraybuffer":s="uint8array";break;case"base64":s="string"}try{this._internalType=s,this._outputType=e,this._mimeType=r,n.checkSupport(s),this._worker=t.pipe(new i(s)),t.lock()}catch(t){this._worker=new a("error"),this._worker.error(t)}}f.prototype={accumulate:function(t){var e;return e=this,new l.Promise(function(r,i){var a=[],o=e._internalType,l=e._outputType,h=e._mimeType;e.on("data",function(e,r){a.push(e),t&&t(r)}).on("error",function(t){a=[],i(t)}).on("end",function(){try{var t=function(t,e,r){switch(t){case"blob":return n.newBlob(n.transformTo("arraybuffer",e),r);case"base64":return s.encode(e);default:return n.transformTo(t,e)}}(l,function(t,e){var r,n=0,i=null,a=0;for(r=0;r<e.length;r++)a+=e[r].length;switch(t){case"string":return e.join("");case"array":return Array.prototype.concat.apply([],e);case"uint8array":for(i=new Uint8Array(a),r=0;r<e.length;r++)i.set(e[r],n),n+=e[r].length;return i;case"nodebuffer":return eJ.concat(e);default:throw Error("concat : unsupported type '"+t+"'")}}(o,a),h);r(t)}catch(t){i(t)}a=[]}).resume()})},on:function(t,e){var r=this;return"data"===t?this._worker.on(t,function(t){e.call(r,t.data,t.meta)}):this._worker.on(t,function(){n.delay(e,arguments,r)}),this},resume:function(){return n.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(t){if(n.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw Error(this._outputType+" is not supported by this method");return new h(this,{objectMode:"nodebuffer"!==this._outputType},t)}},e.exports=f},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(t,e,r){if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer=void 0!==eJ,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else{var n=new ArrayBuffer(0);try{r.blob=0===new Blob([n],{type:"application/zip"}).size}catch(t){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(n),r.blob=0===i.getBlob("application/zip").size}catch(t){r.blob=!1}}}try{r.nodestream=!!t("readable-stream").Readable}catch(t){r.nodestream=!1}},{"readable-stream":16}],31:[function(t,e,r){for(var n=t("./utils"),i=t("./support"),a=t("./nodejsUtils"),s=t("./stream/GenericWorker"),o=Array(256),l=0;l<256;l++)o[l]=252<=l?6:248<=l?5:240<=l?4:224<=l?3:192<=l?2:1;function h(){s.call(this,"utf-8 decode"),this.leftOver=null}function f(){s.call(this,"utf-8 encode")}o[254]=o[254]=1,r.utf8encode=function(t){return i.nodebuffer?a.newBufferFrom(t,"utf-8"):function(t){var e,r,n,a,s,o=t.length,l=0;for(a=0;a<o;a++)55296==(64512&(r=t.charCodeAt(a)))&&a+1<o&&56320==(64512&(n=t.charCodeAt(a+1)))&&(r=65536+(r-55296<<10)+(n-56320),a++),l+=r<128?1:r<2048?2:r<65536?3:4;for(e=i.uint8array?new Uint8Array(l):Array(l),a=s=0;s<l;a++)55296==(64512&(r=t.charCodeAt(a)))&&a+1<o&&56320==(64512&(n=t.charCodeAt(a+1)))&&(r=65536+(r-55296<<10)+(n-56320),a++),r<128?e[s++]=r:(r<2048?e[s++]=192|r>>>6:(r<65536?e[s++]=224|r>>>12:(e[s++]=240|r>>>18,e[s++]=128|r>>>12&63),e[s++]=128|r>>>6&63),e[s++]=128|63&r);return e}(t)},r.utf8decode=function(t){return i.nodebuffer?n.transformTo("nodebuffer",t).toString("utf-8"):function(t){var e,r,i,a,s=t.length,l=Array(2*s);for(e=r=0;e<s;)if((i=t[e++])<128)l[r++]=i;else if(4<(a=o[i]))l[r++]=65533,e+=a-1;else{for(i&=2===a?31:3===a?15:7;1<a&&e<s;)i=i<<6|63&t[e++],a--;1<a?l[r++]=65533:i<65536?l[r++]=i:(i-=65536,l[r++]=55296|i>>10&1023,l[r++]=56320|1023&i)}return l.length!==r&&(l.subarray?l=l.subarray(0,r):l.length=r),n.applyFromCharCode(l)}(t=n.transformTo(i.uint8array?"uint8array":"array",t))},n.inherits(h,s),h.prototype.processChunk=function(t){var e=n.transformTo(i.uint8array?"uint8array":"array",t.data);if(this.leftOver&&this.leftOver.length){if(i.uint8array){var a=e;(e=new Uint8Array(a.length+this.leftOver.length)).set(this.leftOver,0),e.set(a,this.leftOver.length)}else e=this.leftOver.concat(e);this.leftOver=null}var s=function(t,e){var r;for((e=e||t.length)>t.length&&(e=t.length),r=e-1;0<=r&&128==(192&t[r]);)r--;return r<0?e:0===r?e:r+o[t[r]]>e?r:e}(e),l=e;s!==e.length&&(i.uint8array?(l=e.subarray(0,s),this.leftOver=e.subarray(s,e.length)):(l=e.slice(0,s),this.leftOver=e.slice(s,e.length))),this.push({data:r.utf8decode(l),meta:t.meta})},h.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:r.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},r.Utf8DecodeWorker=h,n.inherits(f,s),f.prototype.processChunk=function(t){this.push({data:r.utf8encode(t.data),meta:t.meta})},r.Utf8EncodeWorker=f},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(t,e,r){var n=t("./support"),i=t("./base64"),a=t("./nodejsUtils"),s=t("./external");function o(t){return t}function l(t,e){for(var r=0;r<t.length;++r)e[r]=255&t.charCodeAt(r);return e}t("setimmediate"),r.newBlob=function(t,e){r.checkSupport("blob");try{return new Blob([t],{type:e})}catch(r){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return n.append(t),n.getBlob(e)}catch(t){throw Error("Bug : can't construct the Blob.")}}};var h={stringifyByChunk:function(t,e,r){var n=[],i=0,a=t.length;if(a<=r)return String.fromCharCode.apply(null,t);for(;i<a;)"array"===e||"nodebuffer"===e?n.push(String.fromCharCode.apply(null,t.slice(i,Math.min(i+r,a)))):n.push(String.fromCharCode.apply(null,t.subarray(i,Math.min(i+r,a)))),i+=r;return n.join("")},stringifyByChar:function(t){for(var e="",r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},applyCanBeUsed:{uint8array:function(){try{return n.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(t){return!1}}(),nodebuffer:function(){try{return n.nodebuffer&&1===String.fromCharCode.apply(null,a.allocBuffer(1)).length}catch(t){return!1}}()}};function f(t){var e=65536,n=r.getTypeOf(t),i=!0;if("uint8array"===n?i=h.applyCanBeUsed.uint8array:"nodebuffer"===n&&(i=h.applyCanBeUsed.nodebuffer),i)for(;1<e;)try{return h.stringifyByChunk(t,n,e)}catch(t){e=Math.floor(e/2)}return h.stringifyByChar(t)}function d(t,e){for(var r=0;r<t.length;r++)e[r]=t[r];return e}r.applyFromCharCode=f;var u={};u.string={string:o,array:function(t){return l(t,Array(t.length))},arraybuffer:function(t){return u.string.uint8array(t).buffer},uint8array:function(t){return l(t,new Uint8Array(t.length))},nodebuffer:function(t){return l(t,a.allocBuffer(t.length))}},u.array={string:f,array:o,arraybuffer:function(t){return new Uint8Array(t).buffer},uint8array:function(t){return new Uint8Array(t)},nodebuffer:function(t){return a.newBufferFrom(t)}},u.arraybuffer={string:function(t){return f(new Uint8Array(t))},array:function(t){return d(new Uint8Array(t),Array(t.byteLength))},arraybuffer:o,uint8array:function(t){return new Uint8Array(t)},nodebuffer:function(t){return a.newBufferFrom(new Uint8Array(t))}},u.uint8array={string:f,array:function(t){return d(t,Array(t.length))},arraybuffer:function(t){return t.buffer},uint8array:o,nodebuffer:function(t){return a.newBufferFrom(t)}},u.nodebuffer={string:f,array:function(t){return d(t,Array(t.length))},arraybuffer:function(t){return u.nodebuffer.uint8array(t).buffer},uint8array:function(t){return d(t,new Uint8Array(t.length))},nodebuffer:o},r.transformTo=function(t,e){return(e=e||"",t)?(r.checkSupport(t),u[r.getTypeOf(e)][t](e)):e},r.resolve=function(t){for(var e=t.split("/"),r=[],n=0;n<e.length;n++){var i=e[n];"."===i||""===i&&0!==n&&n!==e.length-1||(".."===i?r.pop():r.push(i))}return r.join("/")},r.getTypeOf=function(t){return"string"==typeof t?"string":"[object Array]"===Object.prototype.toString.call(t)?"array":n.nodebuffer&&a.isBuffer(t)?"nodebuffer":n.uint8array&&t instanceof Uint8Array?"uint8array":n.arraybuffer&&t instanceof ArrayBuffer?"arraybuffer":void 0},r.checkSupport=function(t){if(!n[t.toLowerCase()])throw Error(t+" is not supported by this platform")},r.MAX_VALUE_16BITS=65535,r.MAX_VALUE_32BITS=-1,r.pretty=function(t){var e,r,n="";for(r=0;r<(t||"").length;r++)n+="\\x"+((e=t.charCodeAt(r))<16?"0":"")+e.toString(16).toUpperCase();return n},r.delay=function(t,e,r){setImmediate(function(){t.apply(r||null,e||[])})},r.inherits=function(t,e){function r(){}r.prototype=e.prototype,t.prototype=new r},r.extend=function(){var t,e,r={};for(t=0;t<arguments.length;t++)for(e in arguments[t])Object.prototype.hasOwnProperty.call(arguments[t],e)&&void 0===r[e]&&(r[e]=arguments[t][e]);return r},r.prepareContent=function(t,e,a,o,h){return s.Promise.resolve(e).then(function(t){return n.blob&&(t instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(t)))&&"undefined"!=typeof FileReader?new s.Promise(function(e,r){var n=new FileReader;n.onload=function(t){e(t.target.result)},n.onerror=function(t){r(t.target.error)},n.readAsArrayBuffer(t)}):t}).then(function(e){var f,d=r.getTypeOf(e);return d?("arraybuffer"===d?e=r.transformTo("uint8array",e):"string"===d&&(h?e=i.decode(e):a&&!0!==o&&(e=l(f=e,n.uint8array?new Uint8Array(f.length):Array(f.length)))),e):s.Promise.reject(Error("Can't read the data of '"+t+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(t,e,r){var n=t("./reader/readerFor"),i=t("./utils"),a=t("./signature"),s=t("./zipEntry"),o=t("./support");function l(t){this.files=[],this.loadOptions=t}l.prototype={checkSignature:function(t){if(!this.reader.readAndCheckSignature(t)){this.reader.index-=4;var e=this.reader.readString(4);throw Error("Corrupted zip or bug: unexpected signature ("+i.pretty(e)+", expected "+i.pretty(t)+")")}},isSignature:function(t,e){var r=this.reader.index;this.reader.setIndex(t);var n=this.reader.readString(4)===e;return this.reader.setIndex(r),n},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var t=this.reader.readData(this.zipCommentLength),e=o.uint8array?"uint8array":"array",r=i.transformTo(e,t);this.zipComment=this.loadOptions.decodeFileName(r)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var t,e,r,n=this.zip64EndOfCentralSize-44;0<n;)t=this.reader.readInt(2),e=this.reader.readInt(4),r=this.reader.readData(e),this.zip64ExtensibleData[t]={id:t,length:e,value:r}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var t,e;for(t=0;t<this.files.length;t++)e=this.files[t],this.reader.setIndex(e.localHeaderOffset),this.checkSignature(a.LOCAL_FILE_HEADER),e.readLocalPart(this.reader),e.handleUTF8(),e.processAttributes()},readCentralDir:function(){var t;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER);)(t=new s({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(t);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var t=this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);if(t<0)throw this.isSignature(0,a.LOCAL_FILE_HEADER)?Error("Corrupted zip: can't find end of central directory"):Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(t);var e=t;if(this.checkSignature(a.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(t=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(t),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,a.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20+(12+this.zip64EndOfCentralSize));var n=e-r;if(0<n)this.isSignature(e,a.CENTRAL_FILE_HEADER)||(this.reader.zero=n);else if(n<0)throw Error("Corrupted zip: missing "+Math.abs(n)+" bytes.")},prepareReader:function(t){this.reader=n(t)},load:function(t){this.prepareReader(t),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},e.exports=l},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(t,e,r){var n=t("./reader/readerFor"),i=t("./utils"),a=t("./compressedObject"),s=t("./crc32"),o=t("./utf8"),l=t("./compressions"),h=t("./support");function f(t,e){this.options=t,this.loadOptions=e}f.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(t){var e,r;if(t.skip(22),this.fileNameLength=t.readInt(2),r=t.readInt(2),this.fileName=t.readData(this.fileNameLength),t.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(e=function(t){for(var e in l)if(Object.prototype.hasOwnProperty.call(l,e)&&l[e].magic===t)return l[e];return null}(this.compressionMethod)))throw Error("Corrupted zip : compression "+i.pretty(this.compressionMethod)+" unknown (inner file : "+i.transformTo("string",this.fileName)+")");this.decompressed=new a(this.compressedSize,this.uncompressedSize,this.crc32,e,t.readData(this.compressedSize))},readCentralPart:function(t){this.versionMadeBy=t.readInt(2),t.skip(2),this.bitFlag=t.readInt(2),this.compressionMethod=t.readString(2),this.date=t.readDate(),this.crc32=t.readInt(4),this.compressedSize=t.readInt(4),this.uncompressedSize=t.readInt(4);var e=t.readInt(2);if(this.extraFieldsLength=t.readInt(2),this.fileCommentLength=t.readInt(2),this.diskNumberStart=t.readInt(2),this.internalFileAttributes=t.readInt(2),this.externalFileAttributes=t.readInt(4),this.localHeaderOffset=t.readInt(4),this.isEncrypted())throw Error("Encrypted zip are not supported");t.skip(e),this.readExtraFields(t),this.parseZIP64ExtraField(t),this.fileComment=t.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var t=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==t&&(this.dosPermissions=63&this.externalFileAttributes),3==t&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var t=n(this.extraFields[1].value);this.uncompressedSize===i.MAX_VALUE_32BITS&&(this.uncompressedSize=t.readInt(8)),this.compressedSize===i.MAX_VALUE_32BITS&&(this.compressedSize=t.readInt(8)),this.localHeaderOffset===i.MAX_VALUE_32BITS&&(this.localHeaderOffset=t.readInt(8)),this.diskNumberStart===i.MAX_VALUE_32BITS&&(this.diskNumberStart=t.readInt(4))}},readExtraFields:function(t){var e,r,n,i=t.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});t.index+4<i;)e=t.readInt(2),r=t.readInt(2),n=t.readData(r),this.extraFields[e]={id:e,length:r,value:n};t.setIndex(i)},handleUTF8:function(){var t=h.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else{var e=this.findExtraFieldUnicodePath();if(null!==e)this.fileNameStr=e;else{var r=i.transformTo(t,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r)}var n=this.findExtraFieldUnicodeComment();if(null!==n)this.fileCommentStr=n;else{var a=i.transformTo(t,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(a)}}},findExtraFieldUnicodePath:function(){var t=this.extraFields[28789];if(t){var e=n(t.value);return 1!==e.readInt(1)?null:s(this.fileName)!==e.readInt(4)?null:o.utf8decode(e.readData(t.length-5))}return null},findExtraFieldUnicodeComment:function(){var t=this.extraFields[25461];if(t){var e=n(t.value);return 1!==e.readInt(1)?null:s(this.fileComment)!==e.readInt(4)?null:o.utf8decode(e.readData(t.length-5))}return null}},e.exports=f},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(t,e,r){function n(t,e,r){this.name=t,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=e,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions}}var i=t("./stream/StreamHelper"),a=t("./stream/DataWorker"),s=t("./utf8"),o=t("./compressedObject"),l=t("./stream/GenericWorker");n.prototype={internalStream:function(t){var e=null,r="string";try{if(!t)throw Error("No output type specified.");var n="string"===(r=t.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),e=this._decompressWorker();var a=!this._dataBinary;a&&!n&&(e=e.pipe(new s.Utf8EncodeWorker)),!a&&n&&(e=e.pipe(new s.Utf8DecodeWorker))}catch(t){(e=new l("error")).error(t)}return new i(e,r,"")},async:function(t,e){return this.internalStream(t).accumulate(e)},nodeStream:function(t,e){return this.internalStream(t||"nodebuffer").toNodejsStream(e)},_compressWorker:function(t,e){if(this._data instanceof o&&this._data.compression.magic===t.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new s.Utf8EncodeWorker)),o.createWorkerFrom(r,t,e)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof l?this._data:new a(this._data)}};for(var h=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],f=function(){throw Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},d=0;d<h.length;d++)n.prototype[h[d]]=f;e.exports=n},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(t,e,r){(function(t){var r,n,i=t.MutationObserver||t.WebKitMutationObserver;if(i){var a=0,s=new i(f),o=t.document.createTextNode("");s.observe(o,{characterData:!0}),r=function(){o.data=a=++a%2}}else if(t.setImmediate||void 0===t.MessageChannel)r="document"in t&&"onreadystatechange"in t.document.createElement("script")?function(){var e=t.document.createElement("script");e.onreadystatechange=function(){f(),e.onreadystatechange=null,e.parentNode.removeChild(e),e=null},t.document.documentElement.appendChild(e)}:function(){setTimeout(f,0)};else{var l=new t.MessageChannel;l.port1.onmessage=f,r=function(){l.port2.postMessage(0)}}var h=[];function f(){var t,e;n=!0;for(var r=h.length;r;){for(e=h,h=[],t=-1;++t<r;)e[t]();r=h.length}n=!1}e.exports=function(t){1!==h.push(t)||n||r()}}).call(this,void 0!==l?l:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],37:[function(t,e,r){var n=t("immediate");function i(){}var a={},s=["REJECTED"],o=["FULFILLED"],l=["PENDING"];function h(t){if("function"!=typeof t)throw TypeError("resolver must be a function");this.state=l,this.queue=[],this.outcome=void 0,t!==i&&c(this,t)}function f(t,e,r){this.promise=t,"function"==typeof e&&(this.onFulfilled=e,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected)}function d(t,e,r){n(function(){var n;try{n=e(r)}catch(e){return a.reject(t,e)}n===t?a.reject(t,TypeError("Cannot resolve promise with itself")):a.resolve(t,n)})}function u(t){var e=t&&t.then;if(t&&("object"==typeof t||"function"==typeof t)&&"function"==typeof e)return function(){e.apply(t,arguments)}}function c(t,e){var r=!1;function n(e){r||(r=!0,a.reject(t,e))}function i(e){r||(r=!0,a.resolve(t,e))}var s=_(function(){e(i,n)});"error"===s.status&&n(s.value)}function _(t,e){var r={};try{r.value=t(e),r.status="success"}catch(t){r.status="error",r.value=t}return r}(e.exports=h).prototype.finally=function(t){if("function"!=typeof t)return this;var e=this.constructor;return this.then(function(r){return e.resolve(t()).then(function(){return r})},function(r){return e.resolve(t()).then(function(){throw r})})},h.prototype.catch=function(t){return this.then(null,t)},h.prototype.then=function(t,e){if("function"!=typeof t&&this.state===o||"function"!=typeof e&&this.state===s)return this;var r=new this.constructor(i);return this.state!==l?d(r,this.state===o?t:e,this.outcome):this.queue.push(new f(r,t,e)),r},f.prototype.callFulfilled=function(t){a.resolve(this.promise,t)},f.prototype.otherCallFulfilled=function(t){d(this.promise,this.onFulfilled,t)},f.prototype.callRejected=function(t){a.reject(this.promise,t)},f.prototype.otherCallRejected=function(t){d(this.promise,this.onRejected,t)},a.resolve=function(t,e){var r=_(u,e);if("error"===r.status)return a.reject(t,r.value);var n=r.value;if(n)c(t,n);else{t.state=o,t.outcome=e;for(var i=-1,s=t.queue.length;++i<s;)t.queue[i].callFulfilled(e)}return t},a.reject=function(t,e){t.state=s,t.outcome=e;for(var r=-1,n=t.queue.length;++r<n;)t.queue[r].callRejected(e);return t},h.resolve=function(t){return t instanceof this?t:a.resolve(new this(i),t)},h.reject=function(t){var e=new this(i);return a.reject(e,t)},h.all=function(t){var e=this;if("[object Array]"!==Object.prototype.toString.call(t))return this.reject(TypeError("must be an array"));var r=t.length,n=!1;if(!r)return this.resolve([]);for(var s=Array(r),o=0,l=-1,h=new this(i);++l<r;)(function(t,i){e.resolve(t).then(function(t){s[i]=t,++o!==r||n||(n=!0,a.resolve(h,s))},function(t){n||(n=!0,a.reject(h,t))})})(t[l],l);return h},h.race=function(t){if("[object Array]"!==Object.prototype.toString.call(t))return this.reject(TypeError("must be an array"));var e,r=t.length,n=!1;if(!r)return this.resolve([]);for(var s=-1,o=new this(i);++s<r;)e=t[s],this.resolve(e).then(function(t){n||(n=!0,a.resolve(o,t))},function(t){n||(n=!0,a.reject(o,t))});return o}},{immediate:36}],38:[function(t,e,r){var n={};(0,t("./lib/utils/common").assign)(n,t("./lib/deflate"),t("./lib/inflate"),t("./lib/zlib/constants")),e.exports=n},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(t,e,r){var n=t("./zlib/deflate"),i=t("./utils/common"),a=t("./utils/strings"),s=t("./zlib/messages"),o=t("./zlib/zstream"),l=Object.prototype.toString;function h(t){if(!(this instanceof h))return new h(t);this.options=i.assign({level:-1,method:8,chunkSize:16384,windowBits:15,memLevel:8,strategy:0,to:""},t||{});var e,r=this.options;r.raw&&0<r.windowBits?r.windowBits=-r.windowBits:r.gzip&&0<r.windowBits&&r.windowBits<16&&(r.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new o,this.strm.avail_out=0;var f=n.deflateInit2(this.strm,r.level,r.method,r.windowBits,r.memLevel,r.strategy);if(0!==f)throw Error(s[f]);if(r.header&&n.deflateSetHeader(this.strm,r.header),r.dictionary){if(e="string"==typeof r.dictionary?a.string2buf(r.dictionary):"[object ArrayBuffer]"===l.call(r.dictionary)?new Uint8Array(r.dictionary):r.dictionary,0!==(f=n.deflateSetDictionary(this.strm,e)))throw Error(s[f]);this._dict_set=!0}}function f(t,e){var r=new h(e);if(r.push(t,!0),r.err)throw r.msg||s[r.err];return r.result}h.prototype.push=function(t,e){var r,s,o=this.strm,h=this.options.chunkSize;if(this.ended)return!1;s=e===~~e?e:!0===e?4:0,"string"==typeof t?o.input=a.string2buf(t):"[object ArrayBuffer]"===l.call(t)?o.input=new Uint8Array(t):o.input=t,o.next_in=0,o.avail_in=o.input.length;do{if(0===o.avail_out&&(o.output=new i.Buf8(h),o.next_out=0,o.avail_out=h),1!==(r=n.deflate(o,s))&&0!==r)return this.onEnd(r),this.ended=!0,!1;0!==o.avail_out&&(0!==o.avail_in||4!==s&&2!==s)||("string"===this.options.to?this.onData(a.buf2binstring(i.shrinkBuf(o.output,o.next_out))):this.onData(i.shrinkBuf(o.output,o.next_out)))}while((0<o.avail_in||0===o.avail_out)&&1!==r)return 4===s?(r=n.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,0===r):2!==s||(this.onEnd(0),o.avail_out=0,!0)},h.prototype.onData=function(t){this.chunks.push(t)},h.prototype.onEnd=function(t){0===t&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=i.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},r.Deflate=h,r.deflate=f,r.deflateRaw=function(t,e){return(e=e||{}).raw=!0,f(t,e)},r.gzip=function(t,e){return(e=e||{}).gzip=!0,f(t,e)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(t,e,r){var n=t("./zlib/inflate"),i=t("./utils/common"),a=t("./utils/strings"),s=t("./zlib/constants"),o=t("./zlib/messages"),l=t("./zlib/zstream"),h=t("./zlib/gzheader"),f=Object.prototype.toString;function d(t){if(!(this instanceof d))return new d(t);this.options=i.assign({chunkSize:16384,windowBits:0,to:""},t||{});var e=this.options;e.raw&&0<=e.windowBits&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(0<=e.windowBits&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),15<e.windowBits&&e.windowBits<48&&0==(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new l,this.strm.avail_out=0;var r=n.inflateInit2(this.strm,e.windowBits);if(r!==s.Z_OK)throw Error(o[r]);this.header=new h,n.inflateGetHeader(this.strm,this.header)}function u(t,e){var r=new d(e);if(r.push(t,!0),r.err)throw r.msg||o[r.err];return r.result}d.prototype.push=function(t,e){var r,o,l,h,d,u,c=this.strm,_=this.options.chunkSize,p=this.options.dictionary,m=!1;if(this.ended)return!1;o=e===~~e?e:!0===e?s.Z_FINISH:s.Z_NO_FLUSH,"string"==typeof t?c.input=a.binstring2buf(t):"[object ArrayBuffer]"===f.call(t)?c.input=new Uint8Array(t):c.input=t,c.next_in=0,c.avail_in=c.input.length;do{if(0===c.avail_out&&(c.output=new i.Buf8(_),c.next_out=0,c.avail_out=_),(r=n.inflate(c,s.Z_NO_FLUSH))===s.Z_NEED_DICT&&p&&(u="string"==typeof p?a.string2buf(p):"[object ArrayBuffer]"===f.call(p)?new Uint8Array(p):p,r=n.inflateSetDictionary(this.strm,u)),r===s.Z_BUF_ERROR&&!0===m&&(r=s.Z_OK,m=!1),r!==s.Z_STREAM_END&&r!==s.Z_OK)return this.onEnd(r),this.ended=!0,!1;c.next_out&&(0!==c.avail_out&&r!==s.Z_STREAM_END&&(0!==c.avail_in||o!==s.Z_FINISH&&o!==s.Z_SYNC_FLUSH)||("string"===this.options.to?(l=a.utf8border(c.output,c.next_out),h=c.next_out-l,d=a.buf2string(c.output,l),c.next_out=h,c.avail_out=_-h,h&&i.arraySet(c.output,c.output,l,h,0),this.onData(d)):this.onData(i.shrinkBuf(c.output,c.next_out)))),0===c.avail_in&&0===c.avail_out&&(m=!0)}while((0<c.avail_in||0===c.avail_out)&&r!==s.Z_STREAM_END)return r===s.Z_STREAM_END&&(o=s.Z_FINISH),o===s.Z_FINISH?(r=n.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===s.Z_OK):o!==s.Z_SYNC_FLUSH||(this.onEnd(s.Z_OK),c.avail_out=0,!0)},d.prototype.onData=function(t){this.chunks.push(t)},d.prototype.onEnd=function(t){t===s.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=i.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},r.Inflate=d,r.inflate=u,r.inflateRaw=function(t,e){return(e=e||{}).raw=!0,u(t,e)},r.ungzip=u},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(t,e,r){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(t){for(var e=Array.prototype.slice.call(arguments,1);e.length;){var r=e.shift();if(r){if("object"!=typeof r)throw TypeError(r+"must be non-object");for(var n in r)r.hasOwnProperty(n)&&(t[n]=r[n])}}return t},r.shrinkBuf=function(t,e){return t.length===e?t:t.subarray?t.subarray(0,e):(t.length=e,t)};var i={arraySet:function(t,e,r,n,i){if(e.subarray&&t.subarray)t.set(e.subarray(r,r+n),i);else for(var a=0;a<n;a++)t[i+a]=e[r+a]},flattenChunks:function(t){var e,r,n,i,a,s;for(e=n=0,r=t.length;e<r;e++)n+=t[e].length;for(s=new Uint8Array(n),e=i=0,r=t.length;e<r;e++)a=t[e],s.set(a,i),i+=a.length;return s}},a={arraySet:function(t,e,r,n,i){for(var a=0;a<n;a++)t[i+a]=e[r+a]},flattenChunks:function(t){return[].concat.apply([],t)}};r.setTyped=function(t){t?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,i)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,a))},r.setTyped(n)},{}],42:[function(t,e,r){var n=t("./common"),i=!0,a=!0;try{String.fromCharCode.apply(null,[0])}catch(t){i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){a=!1}for(var s=new n.Buf8(256),o=0;o<256;o++)s[o]=252<=o?6:248<=o?5:240<=o?4:224<=o?3:192<=o?2:1;function l(t,e){if(e<65537&&(t.subarray&&a||!t.subarray&&i))return String.fromCharCode.apply(null,n.shrinkBuf(t,e));for(var r="",s=0;s<e;s++)r+=String.fromCharCode(t[s]);return r}s[254]=s[254]=1,r.string2buf=function(t){var e,r,i,a,s,o=t.length,l=0;for(a=0;a<o;a++)55296==(64512&(r=t.charCodeAt(a)))&&a+1<o&&56320==(64512&(i=t.charCodeAt(a+1)))&&(r=65536+(r-55296<<10)+(i-56320),a++),l+=r<128?1:r<2048?2:r<65536?3:4;for(e=new n.Buf8(l),a=s=0;s<l;a++)55296==(64512&(r=t.charCodeAt(a)))&&a+1<o&&56320==(64512&(i=t.charCodeAt(a+1)))&&(r=65536+(r-55296<<10)+(i-56320),a++),r<128?e[s++]=r:(r<2048?e[s++]=192|r>>>6:(r<65536?e[s++]=224|r>>>12:(e[s++]=240|r>>>18,e[s++]=128|r>>>12&63),e[s++]=128|r>>>6&63),e[s++]=128|63&r);return e},r.buf2binstring=function(t){return l(t,t.length)},r.binstring2buf=function(t){for(var e=new n.Buf8(t.length),r=0,i=e.length;r<i;r++)e[r]=t.charCodeAt(r);return e},r.buf2string=function(t,e){var r,n,i,a,o=e||t.length,h=Array(2*o);for(r=n=0;r<o;)if((i=t[r++])<128)h[n++]=i;else if(4<(a=s[i]))h[n++]=65533,r+=a-1;else{for(i&=2===a?31:3===a?15:7;1<a&&r<o;)i=i<<6|63&t[r++],a--;1<a?h[n++]=65533:i<65536?h[n++]=i:(i-=65536,h[n++]=55296|i>>10&1023,h[n++]=56320|1023&i)}return l(h,n)},r.utf8border=function(t,e){var r;for((e=e||t.length)>t.length&&(e=t.length),r=e-1;0<=r&&128==(192&t[r]);)r--;return r<0?e:0===r?e:r+s[t[r]]>e?r:e}},{"./common":41}],43:[function(t,e,r){e.exports=function(t,e,r,n){for(var i=65535&t|0,a=t>>>16&65535|0,s=0;0!==r;){for(r-=s=2e3<r?2e3:r;a=a+(i=i+e[n++]|0)|0,--s;);i%=65521,a%=65521}return i|a<<16|0}},{}],44:[function(t,e,r){e.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(t,e,r){var n=function(){for(var t,e=[],r=0;r<256;r++){t=r;for(var n=0;n<8;n++)t=1&t?3988292384^t>>>1:t>>>1;e[r]=t}return e}();e.exports=function(t,e,r,i){var a=i+r;t^=-1;for(var s=i;s<a;s++)t=t>>>8^n[255&(t^e[s])];return -1^t}},{}],46:[function(t,e,r){var n,i=t("../utils/common"),a=t("./trees"),s=t("./adler32"),o=t("./crc32"),l=t("./messages");function h(t,e){return t.msg=l[e],e}function f(t){return(t<<1)-(4<t?9:0)}function d(t){for(var e=t.length;0<=--e;)t[e]=0}function u(t){var e=t.state,r=e.pending;r>t.avail_out&&(r=t.avail_out),0!==r&&(i.arraySet(t.output,e.pending_buf,e.pending_out,r,t.next_out),t.next_out+=r,e.pending_out+=r,t.total_out+=r,t.avail_out-=r,e.pending-=r,0===e.pending&&(e.pending_out=0))}function c(t,e){a._tr_flush_block(t,0<=t.block_start?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,u(t.strm)}function _(t,e){t.pending_buf[t.pending++]=e}function p(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e}function m(t,e){var r,n,i=t.max_chain_length,a=t.strstart,s=t.prev_length,o=t.nice_match,l=t.strstart>t.w_size-262?t.strstart-(t.w_size-262):0,h=t.window,f=t.w_mask,d=t.prev,u=t.strstart+258,c=h[a+s-1],_=h[a+s];t.prev_length>=t.good_match&&(i>>=2),o>t.lookahead&&(o=t.lookahead);do if(h[(r=e)+s]===_&&h[r+s-1]===c&&h[r]===h[a]&&h[++r]===h[a+1]){a+=2,r++;do;while(h[++a]===h[++r]&&h[++a]===h[++r]&&h[++a]===h[++r]&&h[++a]===h[++r]&&h[++a]===h[++r]&&h[++a]===h[++r]&&h[++a]===h[++r]&&h[++a]===h[++r]&&a<u)if(n=258-(u-a),a=u-258,s<n){if(t.match_start=e,o<=(s=n))break;c=h[a+s-1],_=h[a+s]}}while((e=d[e&f])>l&&0!=--i)return s<=t.lookahead?s:t.lookahead}function g(t){var e,r,n,a,l,h,f,d,u,c,_=t.w_size;do{if(a=t.window_size-t.lookahead-t.strstart,t.strstart>=_+(_-262)){for(i.arraySet(t.window,t.window,_,_,0),t.match_start-=_,t.strstart-=_,t.block_start-=_,e=r=t.hash_size;n=t.head[--e],t.head[e]=_<=n?n-_:0,--r;);for(e=r=_;n=t.prev[--e],t.prev[e]=_<=n?n-_:0,--r;);a+=_}if(0===t.strm.avail_in)break;if(h=t.strm,f=t.window,d=t.strstart+t.lookahead,c=void 0,(u=a)<(c=h.avail_in)&&(c=u),r=0===c?0:(h.avail_in-=c,i.arraySet(f,h.input,h.next_in,c,d),1===h.state.wrap?h.adler=s(h.adler,f,c,d):2===h.state.wrap&&(h.adler=o(h.adler,f,c,d)),h.next_in+=c,h.total_in+=c,c),t.lookahead+=r,t.lookahead+t.insert>=3)for(l=t.strstart-t.insert,t.ins_h=t.window[l],t.ins_h=(t.ins_h<<t.hash_shift^t.window[l+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[l+3-1])&t.hash_mask,t.prev[l&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=l,l++,t.insert--,!(t.lookahead+t.insert<3)););}while(t.lookahead<262&&0!==t.strm.avail_in)}function v(t,e){for(var r,n;;){if(t.lookahead<262){if(g(t),t.lookahead<262&&0===e)return 1;if(0===t.lookahead)break}if(r=0,t.lookahead>=3&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+3-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==r&&t.strstart-r<=t.w_size-262&&(t.match_length=m(t,r)),t.match_length>=3){if(n=a._tr_tally(t,t.strstart-t.match_start,t.match_length-3),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=3){for(t.match_length--;t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+3-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart,0!=--t.match_length;);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask}else n=a._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(n&&(c(t,!1),0===t.strm.avail_out))return 1}return t.insert=t.strstart<2?t.strstart:2,4===e?(c(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(c(t,!1),0===t.strm.avail_out)?1:2}function b(t,e){for(var r,n,i;;){if(t.lookahead<262){if(g(t),t.lookahead<262&&0===e)return 1;if(0===t.lookahead)break}if(r=0,t.lookahead>=3&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+3-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=2,0!==r&&t.prev_length<t.max_lazy_match&&t.strstart-r<=t.w_size-262&&(t.match_length=m(t,r),t.match_length<=5&&(1===t.strategy||3===t.match_length&&4096<t.strstart-t.match_start)&&(t.match_length=2)),t.prev_length>=3&&t.match_length<=t.prev_length){for(i=t.strstart+t.lookahead-3,n=a._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-3),t.lookahead-=t.prev_length-1,t.prev_length-=2;++t.strstart<=i&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+3-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!=--t.prev_length;);if(t.match_available=0,t.match_length=2,t.strstart++,n&&(c(t,!1),0===t.strm.avail_out))return 1}else if(t.match_available){if((n=a._tr_tally(t,0,t.window[t.strstart-1]))&&c(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return 1}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(n=a._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<2?t.strstart:2,4===e?(c(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(c(t,!1),0===t.strm.avail_out)?1:2}function w(t,e,r,n,i){this.good_length=t,this.max_lazy=e,this.nice_length=r,this.max_chain=n,this.func=i}function y(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=8,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new i.Buf16(1146),this.dyn_dtree=new i.Buf16(122),this.bl_tree=new i.Buf16(78),d(this.dyn_ltree),d(this.dyn_dtree),d(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new i.Buf16(16),this.heap=new i.Buf16(573),d(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new i.Buf16(573),d(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function k(t){var e;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=2,(e=t.state).pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?42:113,t.adler=2===e.wrap?0:1,e.last_flush=0,a._tr_init(e),0):h(t,-2)}function x(t){var e,r=k(t);return 0===r&&((e=t.state).window_size=2*e.w_size,d(e.head),e.max_lazy_match=n[e.level].max_lazy,e.good_match=n[e.level].good_length,e.nice_match=n[e.level].nice_length,e.max_chain_length=n[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=2,e.match_available=0,e.ins_h=0),r}function z(t,e,r,n,a,s){if(!t)return -2;var o=1;if(-1===e&&(e=6),n<0?(o=0,n=-n):15<n&&(o=2,n-=16),a<1||9<a||8!==r||n<8||15<n||e<0||9<e||s<0||4<s)return h(t,-2);8===n&&(n=9);var l=new y;return(t.state=l).strm=t,l.wrap=o,l.gzhead=null,l.w_bits=n,l.w_size=1<<l.w_bits,l.w_mask=l.w_size-1,l.hash_bits=a+7,l.hash_size=1<<l.hash_bits,l.hash_mask=l.hash_size-1,l.hash_shift=~~((l.hash_bits+3-1)/3),l.window=new i.Buf8(2*l.w_size),l.head=new i.Buf16(l.hash_size),l.prev=new i.Buf16(l.w_size),l.lit_bufsize=1<<a+6,l.pending_buf_size=4*l.lit_bufsize,l.pending_buf=new i.Buf8(l.pending_buf_size),l.d_buf=1*l.lit_bufsize,l.l_buf=3*l.lit_bufsize,l.level=e,l.strategy=s,l.method=r,x(t)}n=[new w(0,0,0,0,function(t,e){var r=65535;for(65535>t.pending_buf_size-5&&(r=t.pending_buf_size-5);;){if(t.lookahead<=1){if(g(t),0===t.lookahead&&0===e)return 1;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var n=t.block_start+r;if((0===t.strstart||t.strstart>=n)&&(t.lookahead=t.strstart-n,t.strstart=n,c(t,!1),0===t.strm.avail_out)||t.strstart-t.block_start>=t.w_size-262&&(c(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,4===e?(c(t,!0),0===t.strm.avail_out?3:4):(t.strstart>t.block_start&&(c(t,!1),t.strm.avail_out),1)}),new w(4,4,8,4,v),new w(4,5,16,8,v),new w(4,6,32,32,v),new w(4,4,16,16,b),new w(8,16,32,32,b),new w(8,16,128,128,b),new w(8,32,128,256,b),new w(32,128,258,1024,b),new w(32,258,258,4096,b)],r.deflateInit=function(t,e){return z(t,e,8,15,8,0)},r.deflateInit2=z,r.deflateReset=x,r.deflateResetKeep=k,r.deflateSetHeader=function(t,e){return t&&t.state?2!==t.state.wrap?-2:(t.state.gzhead=e,0):-2},r.deflate=function(t,e){var r,i,s,l;if(!t||!t.state||5<e||e<0)return t?h(t,-2):-2;if(i=t.state,!t.output||!t.input&&0!==t.avail_in||666===i.status&&4!==e)return h(t,0===t.avail_out?-5:-2);if(i.strm=t,r=i.last_flush,i.last_flush=e,42===i.status){if(2===i.wrap)t.adler=0,_(i,31),_(i,139),_(i,8),i.gzhead?(_(i,(i.gzhead.text?1:0)+(i.gzhead.hcrc?2:0)+(i.gzhead.extra?4:0)+(i.gzhead.name?8:0)+(i.gzhead.comment?16:0)),_(i,255&i.gzhead.time),_(i,i.gzhead.time>>8&255),_(i,i.gzhead.time>>16&255),_(i,i.gzhead.time>>24&255),_(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),_(i,255&i.gzhead.os),i.gzhead.extra&&i.gzhead.extra.length&&(_(i,255&i.gzhead.extra.length),_(i,i.gzhead.extra.length>>8&255)),i.gzhead.hcrc&&(t.adler=o(t.adler,i.pending_buf,i.pending,0)),i.gzindex=0,i.status=69):(_(i,0),_(i,0),_(i,0),_(i,0),_(i,0),_(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),_(i,3),i.status=113);else{var m=8+(i.w_bits-8<<4)<<8;m|=(2<=i.strategy||i.level<2?0:i.level<6?1:6===i.level?2:3)<<6,0!==i.strstart&&(m|=32),m+=31-m%31,i.status=113,p(i,m),0!==i.strstart&&(p(i,t.adler>>>16),p(i,65535&t.adler)),t.adler=1}}if(69===i.status){if(i.gzhead.extra){for(s=i.pending;i.gzindex<(65535&i.gzhead.extra.length)&&(i.pending!==i.pending_buf_size||(i.gzhead.hcrc&&i.pending>s&&(t.adler=o(t.adler,i.pending_buf,i.pending-s,s)),u(t),s=i.pending,i.pending!==i.pending_buf_size));)_(i,255&i.gzhead.extra[i.gzindex]),i.gzindex++;i.gzhead.hcrc&&i.pending>s&&(t.adler=o(t.adler,i.pending_buf,i.pending-s,s)),i.gzindex===i.gzhead.extra.length&&(i.gzindex=0,i.status=73)}else i.status=73}if(73===i.status){if(i.gzhead.name){s=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>s&&(t.adler=o(t.adler,i.pending_buf,i.pending-s,s)),u(t),s=i.pending,i.pending===i.pending_buf_size)){l=1;break}l=i.gzindex<i.gzhead.name.length?255&i.gzhead.name.charCodeAt(i.gzindex++):0,_(i,l)}while(0!==l)i.gzhead.hcrc&&i.pending>s&&(t.adler=o(t.adler,i.pending_buf,i.pending-s,s)),0===l&&(i.gzindex=0,i.status=91)}else i.status=91}if(91===i.status){if(i.gzhead.comment){s=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>s&&(t.adler=o(t.adler,i.pending_buf,i.pending-s,s)),u(t),s=i.pending,i.pending===i.pending_buf_size)){l=1;break}l=i.gzindex<i.gzhead.comment.length?255&i.gzhead.comment.charCodeAt(i.gzindex++):0,_(i,l)}while(0!==l)i.gzhead.hcrc&&i.pending>s&&(t.adler=o(t.adler,i.pending_buf,i.pending-s,s)),0===l&&(i.status=103)}else i.status=103}if(103===i.status&&(i.gzhead.hcrc?(i.pending+2>i.pending_buf_size&&u(t),i.pending+2<=i.pending_buf_size&&(_(i,255&t.adler),_(i,t.adler>>8&255),t.adler=0,i.status=113)):i.status=113),0!==i.pending){if(u(t),0===t.avail_out)return i.last_flush=-1,0}else if(0===t.avail_in&&f(e)<=f(r)&&4!==e)return h(t,-5);if(666===i.status&&0!==t.avail_in)return h(t,-5);if(0!==t.avail_in||0!==i.lookahead||0!==e&&666!==i.status){var v=2===i.strategy?function(t,e){for(var r;;){if(0===t.lookahead&&(g(t),0===t.lookahead)){if(0===e)return 1;break}if(t.match_length=0,r=a._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,r&&(c(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,4===e?(c(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(c(t,!1),0===t.strm.avail_out)?1:2}(i,e):3===i.strategy?function(t,e){for(var r,n,i,s,o=t.window;;){if(t.lookahead<=258){if(g(t),t.lookahead<=258&&0===e)return 1;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=3&&0<t.strstart&&(n=o[i=t.strstart-1])===o[++i]&&n===o[++i]&&n===o[++i]){s=t.strstart+258;do;while(n===o[++i]&&n===o[++i]&&n===o[++i]&&n===o[++i]&&n===o[++i]&&n===o[++i]&&n===o[++i]&&n===o[++i]&&i<s)t.match_length=258-(s-i),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=3?(r=a._tr_tally(t,1,t.match_length-3),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(r=a._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),r&&(c(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,4===e?(c(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(c(t,!1),0===t.strm.avail_out)?1:2}(i,e):n[i.level].func(i,e);if(3!==v&&4!==v||(i.status=666),1===v||3===v)return 0===t.avail_out&&(i.last_flush=-1),0;if(2===v&&(1===e?a._tr_align(i):5!==e&&(a._tr_stored_block(i,0,0,!1),3===e&&(d(i.head),0===i.lookahead&&(i.strstart=0,i.block_start=0,i.insert=0))),u(t),0===t.avail_out))return i.last_flush=-1,0}return 4!==e?0:i.wrap<=0?1:(2===i.wrap?(_(i,255&t.adler),_(i,t.adler>>8&255),_(i,t.adler>>16&255),_(i,t.adler>>24&255),_(i,255&t.total_in),_(i,t.total_in>>8&255),_(i,t.total_in>>16&255),_(i,t.total_in>>24&255)):(p(i,t.adler>>>16),p(i,65535&t.adler)),u(t),0<i.wrap&&(i.wrap=-i.wrap),0!==i.pending?0:1)},r.deflateEnd=function(t){var e;return t&&t.state?42!==(e=t.state.status)&&69!==e&&73!==e&&91!==e&&103!==e&&113!==e&&666!==e?h(t,-2):(t.state=null,113===e?h(t,-3):0):-2},r.deflateSetDictionary=function(t,e){var r,n,a,o,l,h,f,u,c=e.length;if(!t||!t.state||2===(o=(r=t.state).wrap)||1===o&&42!==r.status||r.lookahead)return -2;for(1===o&&(t.adler=s(t.adler,e,c,0)),r.wrap=0,c>=r.w_size&&(0===o&&(d(r.head),r.strstart=0,r.block_start=0,r.insert=0),u=new i.Buf8(r.w_size),i.arraySet(u,e,c-r.w_size,r.w_size,0),e=u,c=r.w_size),l=t.avail_in,h=t.next_in,f=t.input,t.avail_in=c,t.next_in=0,t.input=e,g(r);r.lookahead>=3;){for(n=r.strstart,a=r.lookahead-2;r.ins_h=(r.ins_h<<r.hash_shift^r.window[n+3-1])&r.hash_mask,r.prev[n&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=n,n++,--a;);r.strstart=n,r.lookahead=2,g(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=2,r.match_available=0,t.next_in=h,t.input=f,t.avail_in=l,r.wrap=o,0},r.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(t,e,r){e.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(t,e,r){e.exports=function(t,e){var r,n,i,a,s,o,l,h,f,d,u,c,_,p,m,g,v,b,w,y,k,x,z,A,S;r=t.state,n=t.next_in,A=t.input,i=n+(t.avail_in-5),a=t.next_out,S=t.output,s=a-(e-t.avail_out),o=a+(t.avail_out-257),l=r.dmax,h=r.wsize,f=r.whave,d=r.wnext,u=r.window,c=r.hold,_=r.bits,p=r.lencode,m=r.distcode,g=(1<<r.lenbits)-1,v=(1<<r.distbits)-1;r:do for(_<15&&(c+=A[n++]<<_,_+=8,c+=A[n++]<<_,_+=8),b=p[c&g];;){if(c>>>=w=b>>>24,_-=w,0==(w=b>>>16&255))S[a++]=65535&b;else{if(!(16&w)){if(0==(64&w)){b=p[(65535&b)+(c&(1<<w)-1)];continue}if(32&w){r.mode=12;break r}t.msg="invalid literal/length code",r.mode=30;break r}for(y=65535&b,(w&=15)&&(_<w&&(c+=A[n++]<<_,_+=8),y+=c&(1<<w)-1,c>>>=w,_-=w),_<15&&(c+=A[n++]<<_,_+=8,c+=A[n++]<<_,_+=8),b=m[c&v];;){if(c>>>=w=b>>>24,_-=w,!(16&(w=b>>>16&255))){if(0==(64&w)){b=m[(65535&b)+(c&(1<<w)-1)];continue}t.msg="invalid distance code",r.mode=30;break r}if(k=65535&b,_<(w&=15)&&(c+=A[n++]<<_,(_+=8)<w&&(c+=A[n++]<<_,_+=8)),l<(k+=c&(1<<w)-1)){t.msg="invalid distance too far back",r.mode=30;break r}if(c>>>=w,_-=w,(w=a-s)<k){if(f<(w=k-w)&&r.sane){t.msg="invalid distance too far back",r.mode=30;break r}if(z=u,(x=0)===d){if(x+=h-w,w<y){for(y-=w;S[a++]=u[x++],--w;);x=a-k,z=S}}else if(d<w){if(x+=h+d-w,(w-=d)<y){for(y-=w;S[a++]=u[x++],--w;);if(x=0,d<y){for(y-=w=d;S[a++]=u[x++],--w;);x=a-k,z=S}}}else if(x+=d-w,w<y){for(y-=w;S[a++]=u[x++],--w;);x=a-k,z=S}for(;2<y;)S[a++]=z[x++],S[a++]=z[x++],S[a++]=z[x++],y-=3;y&&(S[a++]=z[x++],1<y&&(S[a++]=z[x++]))}else{for(x=a-k;S[a++]=S[x++],S[a++]=S[x++],S[a++]=S[x++],2<(y-=3););y&&(S[a++]=S[x++],1<y&&(S[a++]=S[x++]))}break}}break}while(n<i&&a<o)n-=y=_>>3,c&=(1<<(_-=y<<3))-1,t.next_in=n,t.next_out=a,t.avail_in=n<i?i-n+5:5-(n-i),t.avail_out=a<o?o-a+257:257-(a-o),r.hold=c,r.bits=_}},{}],49:[function(t,e,r){var n=t("../utils/common"),i=t("./adler32"),a=t("./crc32"),s=t("./inffast"),o=t("./inftrees");function l(t){return(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24)}function h(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new n.Buf16(320),this.work=new n.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function f(t){var e;return t&&t.state?(e=t.state,t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=1,e.last=0,e.havedict=0,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new n.Buf32(852),e.distcode=e.distdyn=new n.Buf32(592),e.sane=1,e.back=-1,0):-2}function d(t){var e;return t&&t.state?((e=t.state).wsize=0,e.whave=0,e.wnext=0,f(t)):-2}function u(t,e){var r,n;return t&&t.state?(n=t.state,e<0?(r=0,e=-e):(r=1+(e>>4),e<48&&(e&=15)),e&&(e<8||15<e)?-2:(null!==n.window&&n.wbits!==e&&(n.window=null),n.wrap=r,n.wbits=e,d(t))):-2}function c(t,e){var r,n;return t?(n=new h,(t.state=n).window=null,0!==(r=u(t,e))&&(t.state=null),r):-2}var _,p,m=!0;function g(t,e,r,i){var a,s=t.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new n.Buf8(s.wsize)),i>=s.wsize?(n.arraySet(s.window,e,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(i<(a=s.wsize-s.wnext)&&(a=i),n.arraySet(s.window,e,r-i,a,s.wnext),(i-=a)?(n.arraySet(s.window,e,r-i,i,0),s.wnext=i,s.whave=s.wsize):(s.wnext+=a,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=a))),0}r.inflateReset=d,r.inflateReset2=u,r.inflateResetKeep=f,r.inflateInit=function(t){return c(t,15)},r.inflateInit2=c,r.inflate=function(t,e){var r,h,f,d,u,c,v,b,w,y,k,x,z,A,S,E,C,F,I,R,O,U,T,D,B=0,N=new n.Buf8(4),L=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!t||!t.state||!t.output||!t.input&&0!==t.avail_in)return -2;12===(r=t.state).mode&&(r.mode=13),u=t.next_out,f=t.output,v=t.avail_out,d=t.next_in,h=t.input,c=t.avail_in,b=r.hold,w=r.bits,y=c,k=v,U=0;r:for(;;)switch(r.mode){case 1:if(0===r.wrap){r.mode=13;break}for(;w<16;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}if(2&r.wrap&&35615===b){N[r.check=0]=255&b,N[1]=b>>>8&255,r.check=a(r.check,N,2,0),w=b=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&b)<<8)+(b>>8))%31){t.msg="incorrect header check",r.mode=30;break}if(8!=(15&b)){t.msg="unknown compression method",r.mode=30;break}if(w-=4,O=8+(15&(b>>>=4)),0===r.wbits)r.wbits=O;else if(O>r.wbits){t.msg="invalid window size",r.mode=30;break}r.dmax=1<<O,t.adler=r.check=1,r.mode=512&b?10:12,w=b=0;break;case 2:for(;w<16;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}if(r.flags=b,8!=(255&r.flags)){t.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){t.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=b>>8&1),512&r.flags&&(N[0]=255&b,N[1]=b>>>8&255,r.check=a(r.check,N,2,0)),w=b=0,r.mode=3;case 3:for(;w<32;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}r.head&&(r.head.time=b),512&r.flags&&(N[0]=255&b,N[1]=b>>>8&255,N[2]=b>>>16&255,N[3]=b>>>24&255,r.check=a(r.check,N,4,0)),w=b=0,r.mode=4;case 4:for(;w<16;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}r.head&&(r.head.xflags=255&b,r.head.os=b>>8),512&r.flags&&(N[0]=255&b,N[1]=b>>>8&255,r.check=a(r.check,N,2,0)),w=b=0,r.mode=5;case 5:if(1024&r.flags){for(;w<16;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}r.length=b,r.head&&(r.head.extra_len=b),512&r.flags&&(N[0]=255&b,N[1]=b>>>8&255,r.check=a(r.check,N,2,0)),w=b=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(c<(x=r.length)&&(x=c),x&&(r.head&&(O=r.head.extra_len-r.length,r.head.extra||(r.head.extra=Array(r.head.extra_len)),n.arraySet(r.head.extra,h,d,x,O)),512&r.flags&&(r.check=a(r.check,h,x,d)),c-=x,d+=x,r.length-=x),r.length))break r;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===c)break r;for(x=0;O=h[d+x++],r.head&&O&&r.length<65536&&(r.head.name+=String.fromCharCode(O)),O&&x<c;);if(512&r.flags&&(r.check=a(r.check,h,x,d)),c-=x,d+=x,O)break r}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===c)break r;for(x=0;O=h[d+x++],r.head&&O&&r.length<65536&&(r.head.comment+=String.fromCharCode(O)),O&&x<c;);if(512&r.flags&&(r.check=a(r.check,h,x,d)),c-=x,d+=x,O)break r}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;w<16;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}if(b!==(65535&r.check)){t.msg="header crc mismatch",r.mode=30;break}w=b=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),t.adler=r.check=0,r.mode=12;break;case 10:for(;w<32;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}t.adler=r.check=l(b),w=b=0,r.mode=11;case 11:if(0===r.havedict)return t.next_out=u,t.avail_out=v,t.next_in=d,t.avail_in=c,r.hold=b,r.bits=w,2;t.adler=r.check=1,r.mode=12;case 12:if(5===e||6===e)break r;case 13:if(r.last){b>>>=7&w,w-=7&w,r.mode=27;break}for(;w<3;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}switch(r.last=1&b,w-=1,3&(b>>>=1)){case 0:r.mode=14;break;case 1:if(function(t){if(m){var e;for(_=new n.Buf32(512),p=new n.Buf32(32),e=0;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(o(1,t.lens,0,288,_,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;o(2,t.lens,0,32,p,0,t.work,{bits:5}),m=!1}t.lencode=_,t.lenbits=9,t.distcode=p,t.distbits=5}(r),r.mode=20,6!==e)break;b>>>=2,w-=2;break r;case 2:r.mode=17;break;case 3:t.msg="invalid block type",r.mode=30}b>>>=2,w-=2;break;case 14:for(b>>>=7&w,w-=7&w;w<32;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}if((65535&b)!=(b>>>16^65535)){t.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&b,w=b=0,r.mode=15,6===e)break r;case 15:r.mode=16;case 16:if(x=r.length){if(c<x&&(x=c),v<x&&(x=v),0===x)break r;n.arraySet(f,h,d,x,u),c-=x,d+=x,v-=x,u+=x,r.length-=x;break}r.mode=12;break;case 17:for(;w<14;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}if(r.nlen=257+(31&b),b>>>=5,w-=5,r.ndist=1+(31&b),b>>>=5,w-=5,r.ncode=4+(15&b),b>>>=4,w-=4,286<r.nlen||30<r.ndist){t.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;w<3;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}r.lens[L[r.have++]]=7&b,b>>>=3,w-=3}for(;r.have<19;)r.lens[L[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,T={bits:r.lenbits},U=o(0,r.lens,0,19,r.lencode,0,r.work,T),r.lenbits=T.bits,U){t.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;E=(B=r.lencode[b&(1<<r.lenbits)-1])>>>16&255,C=65535&B,!((S=B>>>24)<=w);){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}if(C<16)b>>>=S,w-=S,r.lens[r.have++]=C;else{if(16===C){for(D=S+2;w<D;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}if(b>>>=S,w-=S,0===r.have){t.msg="invalid bit length repeat",r.mode=30;break}O=r.lens[r.have-1],x=3+(3&b),b>>>=2,w-=2}else if(17===C){for(D=S+3;w<D;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}w-=S,O=0,x=3+(7&(b>>>=S)),b>>>=3,w-=3}else{for(D=S+7;w<D;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}w-=S,O=0,x=11+(127&(b>>>=S)),b>>>=7,w-=7}if(r.have+x>r.nlen+r.ndist){t.msg="invalid bit length repeat",r.mode=30;break}for(;x--;)r.lens[r.have++]=O}}if(30===r.mode)break;if(0===r.lens[256]){t.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,T={bits:r.lenbits},U=o(1,r.lens,0,r.nlen,r.lencode,0,r.work,T),r.lenbits=T.bits,U){t.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,T={bits:r.distbits},U=o(2,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,T),r.distbits=T.bits,U){t.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===e)break r;case 20:r.mode=21;case 21:if(6<=c&&258<=v){t.next_out=u,t.avail_out=v,t.next_in=d,t.avail_in=c,r.hold=b,r.bits=w,s(t,k),u=t.next_out,f=t.output,v=t.avail_out,d=t.next_in,h=t.input,c=t.avail_in,b=r.hold,w=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;E=(B=r.lencode[b&(1<<r.lenbits)-1])>>>16&255,C=65535&B,!((S=B>>>24)<=w);){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}if(E&&0==(240&E)){for(F=S,I=E,R=C;E=(B=r.lencode[R+((b&(1<<F+I)-1)>>F)])>>>16&255,C=65535&B,!(F+(S=B>>>24)<=w);){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}b>>>=F,w-=F,r.back+=F}if(b>>>=S,w-=S,r.back+=S,r.length=C,0===E){r.mode=26;break}if(32&E){r.back=-1,r.mode=12;break}if(64&E){t.msg="invalid literal/length code",r.mode=30;break}r.extra=15&E,r.mode=22;case 22:if(r.extra){for(D=r.extra;w<D;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}r.length+=b&(1<<r.extra)-1,b>>>=r.extra,w-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;E=(B=r.distcode[b&(1<<r.distbits)-1])>>>16&255,C=65535&B,!((S=B>>>24)<=w);){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}if(0==(240&E)){for(F=S,I=E,R=C;E=(B=r.distcode[R+((b&(1<<F+I)-1)>>F)])>>>16&255,C=65535&B,!(F+(S=B>>>24)<=w);){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}b>>>=F,w-=F,r.back+=F}if(b>>>=S,w-=S,r.back+=S,64&E){t.msg="invalid distance code",r.mode=30;break}r.offset=C,r.extra=15&E,r.mode=24;case 24:if(r.extra){for(D=r.extra;w<D;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}r.offset+=b&(1<<r.extra)-1,b>>>=r.extra,w-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){t.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===v)break r;if(x=k-v,r.offset>x){if((x=r.offset-x)>r.whave&&r.sane){t.msg="invalid distance too far back",r.mode=30;break}z=x>r.wnext?(x-=r.wnext,r.wsize-x):r.wnext-x,x>r.length&&(x=r.length),A=r.window}else A=f,z=u-r.offset,x=r.length;for(v<x&&(x=v),v-=x,r.length-=x;f[u++]=A[z++],--x;);0===r.length&&(r.mode=21);break;case 26:if(0===v)break r;f[u++]=r.length,v--,r.mode=21;break;case 27:if(r.wrap){for(;w<32;){if(0===c)break r;c--,b|=h[d++]<<w,w+=8}if(k-=v,t.total_out+=k,r.total+=k,k&&(t.adler=r.check=r.flags?a(r.check,f,k,u-k):i(r.check,f,k,u-k)),k=v,(r.flags?b:l(b))!==r.check){t.msg="incorrect data check",r.mode=30;break}w=b=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;w<32;){if(0===c)break r;c--,b+=h[d++]<<w,w+=8}if(b!==(4294967295&r.total)){t.msg="incorrect length check",r.mode=30;break}w=b=0}r.mode=29;case 29:U=1;break r;case 30:U=-3;break r;case 31:return -4;default:return -2}return t.next_out=u,t.avail_out=v,t.next_in=d,t.avail_in=c,r.hold=b,r.bits=w,(r.wsize||k!==t.avail_out&&r.mode<30&&(r.mode<27||4!==e))&&g(t,t.output,t.next_out,k-t.avail_out)?(r.mode=31,-4):(y-=t.avail_in,k-=t.avail_out,t.total_in+=y,t.total_out+=k,r.total+=k,r.wrap&&k&&(t.adler=r.check=r.flags?a(r.check,f,k,t.next_out-k):i(r.check,f,k,t.next_out-k)),t.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==y&&0===k||4===e)&&0===U&&(U=-5),U)},r.inflateEnd=function(t){if(!t||!t.state)return -2;var e=t.state;return e.window&&(e.window=null),t.state=null,0},r.inflateGetHeader=function(t,e){var r;return t&&t.state?0==(2&(r=t.state).wrap)?-2:((r.head=e).done=!1,0):-2},r.inflateSetDictionary=function(t,e){var r,n=e.length;return t&&t.state?0!==(r=t.state).wrap&&11!==r.mode?-2:11===r.mode&&i(1,e,n,0)!==r.check?-3:g(t,e,n,n)?(r.mode=31,-4):(r.havedict=1,0):-2},r.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(t,e,r){var n=t("../utils/common"),i=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],a=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],s=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],o=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];e.exports=function(t,e,r,l,h,f,d,u){var c,_,p,m,g,v,b,w,y,k=u.bits,x=0,z=0,A=0,S=0,E=0,C=0,F=0,I=0,R=0,O=0,U=null,T=0,D=new n.Buf16(16),B=new n.Buf16(16),N=null,L=0;for(x=0;x<=15;x++)D[x]=0;for(z=0;z<l;z++)D[e[r+z]]++;for(E=k,S=15;1<=S&&0===D[S];S--);if(S<E&&(E=S),0===S)return h[f++]=20971520,h[f++]=20971520,u.bits=1,0;for(A=1;A<S&&0===D[A];A++);for(E<A&&(E=A),x=I=1;x<=15;x++)if(I<<=1,(I-=D[x])<0)return -1;if(0<I&&(0===t||1!==S))return -1;for(B[1]=0,x=1;x<15;x++)B[x+1]=B[x]+D[x];for(z=0;z<l;z++)0!==e[r+z]&&(d[B[e[r+z]]++]=z);if(v=0===t?(U=N=d,19):1===t?(U=i,T-=257,N=a,L-=257,256):(U=s,N=o,-1),x=A,g=f,F=z=O=0,p=-1,m=(R=1<<(C=E))-1,1===t&&852<R||2===t&&592<R)return 1;for(;;){for(b=x-F,y=d[z]<v?(w=0,d[z]):d[z]>v?(w=N[L+d[z]],U[T+d[z]]):(w=96,0),c=1<<x-F,A=_=1<<C;h[g+(O>>F)+(_-=c)]=b<<24|w<<16|y|0,0!==_;);for(c=1<<x-1;O&c;)c>>=1;if(0!==c?(O&=c-1,O+=c):O=0,z++,0==--D[x]){if(x===S)break;x=e[r+d[z]]}if(E<x&&(O&m)!==p){for(0===F&&(F=E),g+=A,I=1<<(C=x-F);C+F<S&&!((I-=D[C+F])<=0);)C++,I<<=1;if(R+=1<<C,1===t&&852<R||2===t&&592<R)return 1;h[p=O&m]=E<<24|C<<16|g-f|0}}return 0!==O&&(h[g+O]=x-F<<24|4194304),u.bits=E,0}},{"../utils/common":41}],51:[function(t,e,r){e.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(t,e,r){var n=t("../utils/common");function i(t){for(var e=t.length;0<=--e;)t[e]=0}var a=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],s=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],o=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],l=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],h=Array(576);i(h);var f=Array(60);i(f);var d=Array(512);i(d);var u=Array(256);i(u);var c=Array(29);i(c);var _,p,m,g=Array(30);function v(t,e,r,n,i){this.static_tree=t,this.extra_bits=e,this.extra_base=r,this.elems=n,this.max_length=i,this.has_stree=t&&t.length}function b(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}function w(t){return t<256?d[t]:d[256+(t>>>7)]}function y(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255}function k(t,e,r){t.bi_valid>16-r?(t.bi_buf|=e<<t.bi_valid&65535,y(t,t.bi_buf),t.bi_buf=e>>16-t.bi_valid,t.bi_valid+=r-16):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=r)}function x(t,e,r){k(t,r[2*e],r[2*e+1])}function z(t,e){for(var r=0;r|=1&t,t>>>=1,r<<=1,0<--e;);return r>>>1}function A(t,e,r){var n,i,a=Array(16),s=0;for(n=1;n<=15;n++)a[n]=s=s+r[n-1]<<1;for(i=0;i<=e;i++){var o=t[2*i+1];0!==o&&(t[2*i]=z(a[o]++,o))}}function S(t){var e;for(e=0;e<286;e++)t.dyn_ltree[2*e]=0;for(e=0;e<30;e++)t.dyn_dtree[2*e]=0;for(e=0;e<19;e++)t.bl_tree[2*e]=0;t.dyn_ltree[512]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0}function E(t){8<t.bi_valid?y(t,t.bi_buf):0<t.bi_valid&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0}function C(t,e,r,n){var i=2*e,a=2*r;return t[i]<t[a]||t[i]===t[a]&&n[e]<=n[r]}function F(t,e,r){for(var n=t.heap[r],i=r<<1;i<=t.heap_len&&(i<t.heap_len&&C(e,t.heap[i+1],t.heap[i],t.depth)&&i++,!C(e,n,t.heap[i],t.depth));)t.heap[r]=t.heap[i],r=i,i<<=1;t.heap[r]=n}function I(t,e,r){var n,i,o,l,h=0;if(0!==t.last_lit)for(;n=t.pending_buf[t.d_buf+2*h]<<8|t.pending_buf[t.d_buf+2*h+1],i=t.pending_buf[t.l_buf+h],h++,0===n?x(t,i,e):(x(t,(o=u[i])+256+1,e),0!==(l=a[o])&&k(t,i-=c[o],l),x(t,o=w(--n),r),0!==(l=s[o])&&k(t,n-=g[o],l)),h<t.last_lit;);x(t,256,e)}function R(t,e){var r,n,i,a=e.dyn_tree,s=e.stat_desc.static_tree,o=e.stat_desc.has_stree,l=e.stat_desc.elems,h=-1;for(t.heap_len=0,t.heap_max=573,r=0;r<l;r++)0!==a[2*r]?(t.heap[++t.heap_len]=h=r,t.depth[r]=0):a[2*r+1]=0;for(;t.heap_len<2;)a[2*(i=t.heap[++t.heap_len]=h<2?++h:0)]=1,t.depth[i]=0,t.opt_len--,o&&(t.static_len-=s[2*i+1]);for(e.max_code=h,r=t.heap_len>>1;1<=r;r--)F(t,a,r);for(i=l;r=t.heap[1],t.heap[1]=t.heap[t.heap_len--],F(t,a,1),n=t.heap[1],t.heap[--t.heap_max]=r,t.heap[--t.heap_max]=n,a[2*i]=a[2*r]+a[2*n],t.depth[i]=(t.depth[r]>=t.depth[n]?t.depth[r]:t.depth[n])+1,a[2*r+1]=a[2*n+1]=i,t.heap[1]=i++,F(t,a,1),2<=t.heap_len;);t.heap[--t.heap_max]=t.heap[1],function(t,e){var r,n,i,a,s,o,l=e.dyn_tree,h=e.max_code,f=e.stat_desc.static_tree,d=e.stat_desc.has_stree,u=e.stat_desc.extra_bits,c=e.stat_desc.extra_base,_=e.stat_desc.max_length,p=0;for(a=0;a<=15;a++)t.bl_count[a]=0;for(l[2*t.heap[t.heap_max]+1]=0,r=t.heap_max+1;r<573;r++)_<(a=l[2*l[2*(n=t.heap[r])+1]+1]+1)&&(a=_,p++),l[2*n+1]=a,h<n||(t.bl_count[a]++,s=0,c<=n&&(s=u[n-c]),o=l[2*n],t.opt_len+=o*(a+s),d&&(t.static_len+=o*(f[2*n+1]+s)));if(0!==p){do{for(a=_-1;0===t.bl_count[a];)a--;t.bl_count[a]--,t.bl_count[a+1]+=2,t.bl_count[_]--,p-=2}while(0<p)for(a=_;0!==a;a--)for(n=t.bl_count[a];0!==n;)h<(i=t.heap[--r])||(l[2*i+1]!==a&&(t.opt_len+=(a-l[2*i+1])*l[2*i],l[2*i+1]=a),n--)}}(t,e),A(a,h,t.bl_count)}function O(t,e,r){var n,i,a=-1,s=e[1],o=0,l=7,h=4;for(0===s&&(l=138,h=3),e[2*(r+1)+1]=65535,n=0;n<=r;n++)i=s,s=e[2*(n+1)+1],++o<l&&i===s||(o<h?t.bl_tree[2*i]+=o:0!==i?(i!==a&&t.bl_tree[2*i]++,t.bl_tree[32]++):o<=10?t.bl_tree[34]++:t.bl_tree[36]++,a=i,h=(o=0)===s?(l=138,3):i===s?(l=6,3):(l=7,4))}function U(t,e,r){var n,i,a=-1,s=e[1],o=0,l=7,h=4;for(0===s&&(l=138,h=3),n=0;n<=r;n++)if(i=s,s=e[2*(n+1)+1],!(++o<l&&i===s)){if(o<h)for(;x(t,i,t.bl_tree),0!=--o;);else 0!==i?(i!==a&&(x(t,i,t.bl_tree),o--),x(t,16,t.bl_tree),k(t,o-3,2)):o<=10?(x(t,17,t.bl_tree),k(t,o-3,3)):(x(t,18,t.bl_tree),k(t,o-11,7));a=i,h=(o=0)===s?(l=138,3):i===s?(l=6,3):(l=7,4)}}i(g);var T=!1;function D(t,e,r,i){k(t,0+(i?1:0),3),E(t),y(t,r),y(t,~r),n.arraySet(t.pending_buf,t.window,e,r,t.pending),t.pending+=r}r._tr_init=function(t){T||(function(){var t,e,r,n,i,l=Array(16);for(n=r=0;n<28;n++)for(c[n]=r,t=0;t<1<<a[n];t++)u[r++]=n;for(u[r-1]=n,n=i=0;n<16;n++)for(g[n]=i,t=0;t<1<<s[n];t++)d[i++]=n;for(i>>=7;n<30;n++)for(g[n]=i<<7,t=0;t<1<<s[n]-7;t++)d[256+i++]=n;for(e=0;e<=15;e++)l[e]=0;for(t=0;t<=143;)h[2*t+1]=8,t++,l[8]++;for(;t<=255;)h[2*t+1]=9,t++,l[9]++;for(;t<=279;)h[2*t+1]=7,t++,l[7]++;for(;t<=287;)h[2*t+1]=8,t++,l[8]++;for(A(h,287,l),t=0;t<30;t++)f[2*t+1]=5,f[2*t]=z(t,5);_=new v(h,a,257,286,15),p=new v(f,s,0,30,15),m=new v([],o,0,19,7)}(),T=!0),t.l_desc=new b(t.dyn_ltree,_),t.d_desc=new b(t.dyn_dtree,p),t.bl_desc=new b(t.bl_tree,m),t.bi_buf=0,t.bi_valid=0,S(t)},r._tr_stored_block=D,r._tr_flush_block=function(t,e,r,n){var i,a,s=0;0<t.level?(2===t.strm.data_type&&(t.strm.data_type=function(t){var e,r=4093624447;for(e=0;e<=31;e++,r>>>=1)if(1&r&&0!==t.dyn_ltree[2*e])return 0;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return 1;for(e=32;e<256;e++)if(0!==t.dyn_ltree[2*e])return 1;return 0}(t)),R(t,t.l_desc),R(t,t.d_desc),s=function(t){var e;for(O(t,t.dyn_ltree,t.l_desc.max_code),O(t,t.dyn_dtree,t.d_desc.max_code),R(t,t.bl_desc),e=18;3<=e&&0===t.bl_tree[2*l[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}(t),i=t.opt_len+3+7>>>3,(a=t.static_len+3+7>>>3)<=i&&(i=a)):i=a=r+5,r+4<=i&&-1!==e?D(t,e,r,n):4===t.strategy||a===i?(k(t,2+(n?1:0),3),I(t,h,f)):(k(t,4+(n?1:0),3),function(t,e,r,n){var i;for(k(t,e-257,5),k(t,r-1,5),k(t,n-4,4),i=0;i<n;i++)k(t,t.bl_tree[2*l[i]+1],3);U(t,t.dyn_ltree,e-1),U(t,t.dyn_dtree,r-1)}(t,t.l_desc.max_code+1,t.d_desc.max_code+1,s+1),I(t,t.dyn_ltree,t.dyn_dtree)),S(t),n&&E(t)},r._tr_tally=function(t,e,r){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&r,t.last_lit++,0===e?t.dyn_ltree[2*r]++:(t.matches++,e--,t.dyn_ltree[2*(u[r]+256+1)]++,t.dyn_dtree[2*w(e)]++),t.last_lit===t.lit_bufsize-1},r._tr_align=function(t){k(t,2,3),x(t,256,h),16===t.bi_valid?(y(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):8<=t.bi_valid&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}},{"../utils/common":41}],53:[function(t,e,r){e.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(t,e,r){(function(t){!function(t,e){if(!t.setImmediate){var r,n,i,a,s=1,o={},l=!1,h=t.document,f=Object.getPrototypeOf&&Object.getPrototypeOf(t);f=f&&f.setTimeout?f:t,r="[object process]"===({}).toString.call(t.process)?function(t){eV.nextTick(function(){u(t)})}:!function(){if(t.postMessage&&!t.importScripts){var e=!0,r=t.onmessage;return t.onmessage=function(){e=!1},t.postMessage("","*"),t.onmessage=r,e}}()?t.MessageChannel?((i=new MessageChannel).port1.onmessage=function(t){u(t.data)},function(t){i.port2.postMessage(t)}):h&&"onreadystatechange"in h.createElement("script")?(n=h.documentElement,function(t){var e=h.createElement("script");e.onreadystatechange=function(){u(t),e.onreadystatechange=null,n.removeChild(e),e=null},n.appendChild(e)}):function(t){setTimeout(u,0,t)}:(a="setImmediate$"+Math.random()+"$",t.addEventListener?t.addEventListener("message",c,!1):t.attachEvent("onmessage",c),function(e){t.postMessage(a+e,"*")}),f.setImmediate=function(t){"function"!=typeof t&&(t=Function(""+t));for(var e=Array(arguments.length-1),n=0;n<e.length;n++)e[n]=arguments[n+1];var i={callback:t,args:e};return o[s]=i,r(s),s++},f.clearImmediate=d}function d(t){delete o[t]}function u(t){if(l)setTimeout(u,0,t);else{var e=o[t];if(e){l=!0;try{!function(t){var e=t.callback,r=t.args;switch(r.length){case 0:e();break;case 1:e(r[0]);break;case 2:e(r[0],r[1]);break;case 3:e(r[0],r[1],r[2]);break;default:e.apply(void 0,r)}}(e)}finally{d(t),l=!1}}}}function c(e){e.source===t&&"string"==typeof e.data&&0===e.data.indexOf(a)&&u(+e.data.slice(a.length))}}("undefined"==typeof self?void 0===t?this:t:self)}).call(this,void 0!==l?l:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[10])(10);for(var eq=self,e$=["inflate","gunzip","unzlib"],eQ=function(t){var e=new Uint8Array(t.reduce(function(t,e){return e.length+t},0)),r=0,n=!0,i=!1,a=void 0;try{for(var s,o=t[Symbol.iterator]();!(n=(s=o.next()).done);n=!0){var l=s.value;e.set(l,r),r+=l.length}}catch(t){i=!0,a=t}finally{try{n||null==o.return||o.return()}finally{if(i)throw a}}return e},e0=new Uint32Array(256),e1=0;e1<256;++e1){for(var e2=e1,e5=9;--e5;)e2=(1&e2&&3988292384)^e2>>>1;e0[e1]=e2}var e6=function(t){for(var e=4294967295,r=0;r<t.length;++r)e=e0[255&e^t[r]]^e>>>8;return 4294967295^e},e3=function(t){var e=eK.deflateRaw(t),r=new Uint8Array([31,139,8,0,0,0,0,0,0,0]),n=e6(t),i=e.length;return eQ([r,e,new Uint8Array([255&n,n>>>8&255,n>>>16&255,n>>>32&255,255&i,i>>>8&255,i>>>16&255,i>>>32&255])])};onmessage=function(e){var r=function(t){if(Array.isArray(t))return t}(s=e.data)||function(t,e){var r,n,i=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=i){var a=[],s=!0,o=!1;try{for(i=i.call(t);!(s=(r=i.next()).done)&&(a.push(r.value),!e||a.length!==e);s=!0);}catch(t){o=!0,n=t}finally{try{s||null==i.return||i.return()}finally{if(o)throw n}}return a}}(s,2)||function(t,e){if(t){if("string"==typeof t)return h(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);if("Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return h(t,e)}}(s,2)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),n=r[0],i=r[1];if("pako"==n){if("zip"==i){var a=new/*@__PURE__*/(t(eX));onmessage=function(t){t.data?a.file(t.data[0],t.data[1]):a.generateAsync({type:"uint8array",compressionOptions:{level:6}}).then(function(t){eq.postMessage([t,!0],[t.buffer])})}}else if("unzip"==i)onmessage=function(e){/*@__PURE__*/t(eX).loadAsync(e.data).then(function(t){var e={},r=[];for(var n in t.files)!function(n){var i=t.files[n];r.push(i.async("uint8array").then(function(t){return e[i.name]=t,t.buffer}))}(n);Promise.all(r).then(function(t){eq.postMessage([e,!0],t)})})};else{var s,o,l=-1==e$.indexOf(i)?new eG.Deflate("gzip"==i?{gzip:!0}:{raw:"inflate"==i}):new eG.Inflate({raw:"deflate"==i});l.onData=function(t){o&&eq.postMessage([o,!1],[o.buffer]),o=t},onmessage=function(t){l.push(t.data[0],t.data[1]),t.data[1]&&eq.postMessage([o,!0],[o.buffer])}}}else if("uzip"==n){if("zip"==i){var f={};onmessage=function(t){if(t.data)f[t.data[0]]=t.data[1];else{var e=eK.encode(f);eq.postMessage([new Uint8Array(e),!0],[e])}}}else if("unzip"==i)onmessage=function(t){var e=eK.parse(t.data.buffer),r=[];for(var n in e)r.push(e[n]),e[n]=new Uint8Array(e[n]);eq.postMessage([e,!0],r)};else{var d=[];onmessage=function(t){if(d.push(t.data[0]),t.data[1]){var e=eQ(d),r="inflate"==i?eK.inflateRaw(e):"deflate"==i?eK.deflateRaw(e):"zlib"==i?eK.deflate(e):"unzlib"==i?eK.inflate(e):"gzip"==i?e3(e):eK.inflateRaw(e.subarray(10,-8));eq.postMessage([r,!0],[r.buffer])}}}}}}();//# sourceMappingURL=workers.90bcdfdf.js.map

//# sourceMappingURL=workers.90bcdfdf.js.map

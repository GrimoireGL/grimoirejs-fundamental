/*Header start*/
// helper macros
#ifdef FS
  #define FS_PREC_FLOAT(fprec) precision fprec float;
  #define FS_PREC_INT(iprec) precision iprec int;
  #define VS_PREC_FLOAT(fprec)
  #define VS_PREC_INT(iprec)
#endif
#ifdef VS
  #define FS_PREC_FLOAT(fprec)
  #define FS_PREC_INT(iprec)
  #define VS_PREC_FLOAT(fprec) precision fprec float;
  #define VS_PREC_INT(iprec) precision iprec int;
#endif
// constants
#define PI 3.141592653589793
#define E 2.718281828459045
#define LN2 0.6931471805599453
#define LN10 2.302585092994046
#define LOG2E 1.4426950408889634
#define LOG10E 0.4342944819032518
#define SQRT2 1.4142135623730951
#define SQRT1_2 0.7071067811865476
/*Header end*/

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

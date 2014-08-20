import javax.script.CompiledScript;
import javax.script.Compilable;
import javax.script.ScriptException;
 
import jdk.nashorn.api.scripting.NashornScriptEngineFactory;
 
import java.util.concurrent.Future;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.Callable;
 
import java.util.ArrayList;
 
public class SSCCE {
  private static final NashornScriptEngineFactory engineFactory = new NashornScriptEngineFactory();
   
  public static void main(String[] args) throws ScriptException, InterruptedException, ExecutionException {
    Compilable engine = (Compilable) engineFactory.getScriptEngine();
     
    String script = new StringBuilder("i = 0.0;")
      .append("i += 1;")
      .append("shortly_later = new Date()/1000 + Math.random;") // 0..1 sec later
      .append("while( (new Date()/1000) < shortly_later) { Math.random() };") //prevent optimizations
      .append("i += 1;")
      .toString();
     
    final CompiledScript onePlusOne = engine.compile(script);
     
    Callable<Double> addition = new Callable<Double>() {
      @Override
      public Double call() {
        try {
          return (Double) onePlusOne.eval();
        }
        catch(ScriptException e) {
          throw new RuntimeException(e);
        }
      }
    };
     
    ExecutorService executor = Executors.newCachedThreadPool();
    ArrayList<Future<Double>> results = new ArrayList<Future<Double>>();
     
    for(int i = 0; i < 50; i++) {
      results.add(executor.submit(addition));
    }
     
    int miscalculations = 0;
    for(Future<Double> result : results) {
      int jsResult = result.get().intValue();
       
      if(jsResult != 2) {
        System.out.println("Incorrect result from js, expected 1 + 1 = 2, but got " + jsResult);
        miscalculations += 1;
      }
    }
     
    executor.awaitTermination(1, TimeUnit.SECONDS);
    executor.shutdownNow();
     
    System.out.println("Overall: " + miscalculations + " wrong values for 1 + 1.");
  }
}

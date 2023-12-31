package pl.edu.agh.student.rentsys.logs;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.UnsynchronizedAppenderBase;
import org.komamitsu.fluency.Fluency;
import org.komamitsu.fluency.fluentd.FluencyBuilderForFluentd;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class FluencyLogbackAppender extends UnsynchronizedAppenderBase<ILoggingEvent> {
    private Fluency fluency;
    private String label = "rentsys";

    @Override
    public void start() {
        super.start();
        this.fluency = new FluencyBuilderForFluentd().build("fluentd", 24224);
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("msg", "Starting App");
        try {
            fluency.emit(label, data);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void append(ILoggingEvent rawData) {
        String msg = rawData.toString();
        Map<String, Object> data = new HashMap<String, Object>(1);
        data.put("msg", msg);
        try {
            fluency.emit(label, data);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void stop() {
        super.stop();
        try {
            fluency.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

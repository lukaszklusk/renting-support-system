package pl.edu.agh.student.rentsys.controller;


import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.util.JRLoader;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimplePdfExporterConfiguration;
import net.sf.jasperreports.export.SimplePdfReportConfiguration;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.EntityManagerFactoryInfo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.student.rentsys.model.User;
import pl.edu.agh.student.rentsys.service.UserService;

import javax.sql.DataSource;
import java.io.InputStream;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Optional;

@RestController
public class ReportDataController {

    @PersistenceContext
    EntityManager entityManager;

    private final UserService userService;

    public ReportDataController(UserService userService) {
        this.userService = userService;
    }

    private DataSource getDatasource(){
        EntityManagerFactoryInfo info = (EntityManagerFactoryInfo) entityManager.getEntityManagerFactory();
        return info.getDataSource();
    }


    @GetMapping("/user/{username}/report")
    public ResponseEntity createReport(@PathVariable String username) {
        Optional<User> userOptional =  userService.getUserByUsername(username);
        if(!userOptional.isPresent()){
            return ResponseEntity.notFound().build();
        }
        int userID = userOptional.get().getId().intValue();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String current_date = dtf.format(LocalDateTime.now());
        try {
            HashMap<String,Object> params = new HashMap<>();
            params.put("owner", userID);
            params.put("current_date", current_date);

            InputStream stream = this.getClass().getResourceAsStream("/rentsys_report.jasper");
            JasperReport report = (JasperReport) JRLoader.loadObject(stream);
            JasperPrint print = JasperFillManager.fillReport(
                    report,params,getDatasource().getConnection());

            JRPdfExporter exporter = new JRPdfExporter();
            exporter.setExporterInput(new SimpleExporterInput(print));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput("report_" + username + ".pdf"));

            SimplePdfReportConfiguration reportConfiguration = new SimplePdfReportConfiguration();
            reportConfiguration.setSizePageToContent(true);
            reportConfiguration.setForceLineBreakPolicy(false);

            SimplePdfExporterConfiguration exporterConfiguration = new SimplePdfExporterConfiguration();
            exporterConfiguration.setMetadataAuthor("rent-sys");
            exporterConfiguration.setEncrypted(true);
            exporterConfiguration.setAllowedPermissionsHint("PRINTING");

            exporter.setConfiguration(reportConfiguration);
            exporter.setConfiguration(exporterConfiguration);

            exporter.exportReport();
        } catch (JRException | SQLException e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok("ok");
    }
}

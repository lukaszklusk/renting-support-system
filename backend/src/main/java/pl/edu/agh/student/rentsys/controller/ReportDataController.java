package pl.edu.agh.student.rentsys.controller;


import ch.qos.logback.classic.Logger;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpServletResponse;
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
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.EntityManagerFactoryInfo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.student.rentsys.model.User;
import pl.edu.agh.student.rentsys.service.UserService;

import javax.sql.DataSource;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Optional;

@RestController
public class ReportDataController {

    private final Logger logger = (Logger) LoggerFactory.getLogger(ReportDataController.class);

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


    @GetMapping(value = "/user/{username}/report/detailed", produces = MediaType.APPLICATION_PDF_VALUE)
    public @ResponseBody ResponseEntity<byte[]> createReport(@PathVariable String username, HttpServletResponse response) {
        logger.info("GET /user/" + username + "/report/detailed");
        Optional<User> userOptional =  userService.getUserByUsername(username);
        if(!userOptional.isPresent()){
            return ResponseEntity.notFound().build();
        }
        int userID = userOptional.get().getId().intValue();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("dd_MM_yyyy");
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
            ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream();
            exporter.setExporterInput(new SimpleExporterInput(print));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(pdfOutputStream));

            response.setHeader("Content-Disposition",
                    "attachment; filename=report_" + userID + "_" + dtf2.format(LocalDateTime.now()) + ".pdf");

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

            byte[] res = pdfOutputStream.toByteArray();
            return ResponseEntity.ok(res);
        } catch (JRException | SQLException e) {
            e.printStackTrace();
        }

        return ResponseEntity.internalServerError().build();
    }

    @GetMapping(value = "/user/{username}/report/simple", produces = MediaType.APPLICATION_PDF_VALUE)
    public @ResponseBody ResponseEntity<byte[]> createReportSimple(@PathVariable String username, HttpServletResponse response) {
        logger.info("GET /user/" + username + "/report/simple");
        Optional<User> userOptional =  userService.getUserByUsername(username);
        if(!userOptional.isPresent()){
            return ResponseEntity.notFound().build();
        }
        int userID = userOptional.get().getId().intValue();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("dd_MM_yyyy");
        String current_date = dtf.format(LocalDateTime.now());
        try {
            HashMap<String,Object> params = new HashMap<>();
            params.put("owner", userID);
            params.put("current_date", current_date);

            InputStream stream = this.getClass().getResourceAsStream("/rentsys_report_simple.jasper");
            JasperReport report = (JasperReport) JRLoader.loadObject(stream);
            JasperPrint print = JasperFillManager.fillReport(
                    report,params,getDatasource().getConnection());

            JRPdfExporter exporter = new JRPdfExporter();
            ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream();
            exporter.setExporterInput(new SimpleExporterInput(print));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(pdfOutputStream));

            response.setHeader("Content-Disposition",
                    "attachment; filename=simple_report_" + userID + "_" + dtf2.format(LocalDateTime.now()) + ".pdf");

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

            byte[] res = pdfOutputStream.toByteArray();
            return ResponseEntity.ok(res);
        } catch (JRException | SQLException e) {
            e.printStackTrace();
        }

        return ResponseEntity.internalServerError().build();
    }

    @GetMapping(value = "/user/{username}/report/overview", produces = MediaType.APPLICATION_PDF_VALUE)
    public @ResponseBody ResponseEntity<byte[]> createReportoverview(@PathVariable String username, HttpServletResponse response) {
        logger.info("GET /user/" + username + "/report/overview");
        Optional<User> userOptional =  userService.getUserByUsername(username);
        if(!userOptional.isPresent()){
            return ResponseEntity.notFound().build();
        }
        int userID = userOptional.get().getId().intValue();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("dd_MM_yyyy");
        String current_date = dtf.format(LocalDateTime.now());
        try {
            HashMap<String,Object> params = new HashMap<>();
            params.put("owner", userID);
            params.put("current_date", current_date);

            InputStream stream = this.getClass().getResourceAsStream("/rentsys_report_overview.jasper");
            JasperReport report = (JasperReport) JRLoader.loadObject(stream);
            JasperPrint print = JasperFillManager.fillReport(
                    report,params,getDatasource().getConnection());

            JRPdfExporter exporter = new JRPdfExporter();
            ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream();
            exporter.setExporterInput(new SimpleExporterInput(print));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(pdfOutputStream));

            response.setHeader("Content-Disposition",
                    "attachment; filename=overview_report_" + userID + "_" + dtf2.format(LocalDateTime.now()) + ".pdf");

            SimplePdfReportConfiguration reportConfiguration = new SimplePdfReportConfiguration();
            reportConfiguration.setSizePageToContent(true);
            reportConfiguration.setForceLineBreakPolicy(false);

            SimplePdfExporterConfiguration exporterConfiguration = new SimplePdfExporterConfiguration();
            exporterConfiguration.setMetadataAuthor("rent-sys");
            exporterConfiguration.setAllowedPermissionsHint("PRINTING");

            exporter.setConfiguration(reportConfiguration);
            exporter.setConfiguration(exporterConfiguration);

            exporter.exportReport();

            byte[] res = pdfOutputStream.toByteArray();
            return ResponseEntity.ok(res);
        } catch (JRException | SQLException e) {
            e.printStackTrace();
        }

        return ResponseEntity.internalServerError().build();
    }
}

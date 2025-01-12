using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Options;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<DoctorId> DoctorIds { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      optionsBuilder.ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.HasPostgresExtension("uuid-ossp");

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .HasColumnType("uuid")
                    .HasDefaultValueSql("uuid_generate_v4()")
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Role).HasMaxLength(50).HasDefaultValue("Doctor");
              entity.Property(e => e.FirstName).HasMaxLength(100);
              entity.Property(e => e.LastName).HasMaxLength(100);
              entity.Property(e => e.DateOfBirth).HasColumnType("timestamp with time zone");
              entity.Property(e => e.Gender);
              entity.Property(e => e.ContactInformation).HasMaxLength(200);
              entity.Property(e => e.Address).HasMaxLength(300);
              // Configure one-to-one relationship with MedicalRecord
              entity.HasOne(e => e.MedicalHistory)
                  .WithOne()
                  .HasForeignKey<MedicalRecord>(mr => mr.PatientId)
                  .OnDelete(DeleteBehavior.Cascade);

              // Configure one-to-many relationship with Appointments
              entity.HasMany(e => e.Appointments)
                  .WithOne()
                  .HasForeignKey(a => a.PatientId)
                  .OnDelete(DeleteBehavior.Cascade);

              // Configure one-to-many relationship with Prescriptions
              entity.HasMany(e => e.Prescriptions)
                    .WithOne(p => p.Patient)
                    .HasForeignKey(p => p.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);
            });


          modelBuilder.Entity<MedicalRecord>(entity =>
            {
                entity.ToTable("medical_records");
                entity.HasKey(e => e.RecordId);
                entity.Property(e => e.RecordId)
                    .HasColumnType("uuid")
                    .HasDefaultValueSql("uuid_generate_v4()")
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.PatientId).IsRequired();
                entity.Property(e => e.Date).IsRequired();
                entity.Property(e => e.Diagnosis).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Notes).HasMaxLength(1000);
                //entity.HasMany(e => e.Prescriptions)
                //    .WithOne()
                //    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.ToTable("appointments");
                entity.HasKey(e => e.AppointmentId);
                entity.Property(e => e.AppointmentId)
                    .HasColumnType("uuid")
                    .HasDefaultValueSql("uuid_generate_v4()")
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.PatientId).IsRequired();
                entity.Property(e => e.ProviderId).IsRequired();
                entity.Property(e => e.AppointmentDate).IsRequired();
                entity.Property(e => e.Reason).HasMaxLength(1000);
                entity.Property(e => e.Status).HasDefaultValue(AppointmentStatus.Scheduled);

                // Configure foreign keys
                entity.HasOne<User>()
                    .WithMany(p => p.Appointments)
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(e => e.ProviderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<Prescription>(entity =>
            {
              entity.ToTable("prescriptions");
              entity.HasKey(e => e.PrescriptionId);
              entity.Property(e => e.PrescriptionId)
                  .HasColumnType("uuid")
                  .HasDefaultValueSql("uuid_generate_v4()")
                  .ValueGeneratedOnAdd();
              entity.Property(e => e.PatientId).IsRequired();
              entity.Property(e => e.MedicationName).IsRequired().HasMaxLength(100);
              entity.Property(e => e.Dosage).IsRequired().HasMaxLength(100);
              entity.Property(e => e.Frequency).IsRequired().HasMaxLength(100);
              entity.Property(e => e.StartDate).IsRequired().HasColumnType("timestamp with time zone");
              entity.Property(e => e.EndDate).IsRequired().HasColumnType("timestamp with time zone");
              entity.Property(e => e.Notes).HasMaxLength(1000);

              // Configure foreign key relationship with Patient
              entity.HasOne(p => p.Patient)
                  .WithMany(p => p.Prescriptions)
                  .HasForeignKey(e => e.PatientId)
                  .OnDelete(DeleteBehavior.Cascade);
            });
      base.OnModelCreating(modelBuilder);
    }
    }
}

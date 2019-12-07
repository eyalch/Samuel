# Generated by Django 2.2.7 on 2019-12-05 00:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dishes', '0003_order'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dish',
            name='next_date',
        ),
        migrations.RemoveField(
            model_name='order',
            name='dish',
        ),
        migrations.AlterField(
            model_name='order',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='ScheduledDish',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('dish', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dishes.Dish')),
            ],
            options={
                'verbose_name_plural': 'scheduled dishes',
            },
        ),
        migrations.AddField(
            model_name='order',
            name='scheduled_dish',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='dishes.ScheduledDish'),
            preserve_default=False,
        ),
        migrations.AddConstraint(
            model_name='scheduleddish',
            constraint=models.UniqueConstraint(fields=('dish', 'date'), name='unique_scheduled_dish'),
        ),
    ]